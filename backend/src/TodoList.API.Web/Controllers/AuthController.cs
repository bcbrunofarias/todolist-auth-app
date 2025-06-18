using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TodoList.API.Web.Auth.Password;
using TodoList.API.Web.Auth.Token;
using TodoList.API.Web.Data.EF;
using TodoList.API.Web.Models;
using TodoList.API.Web.Models.Request;
using TodoList.API.Web.Models.Response;

namespace TodoList.API.Web.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(AppDbContext context, 
    ITokenService tokenService, 
    IPasswordService passwordService,
    IHttpContextAccessor httpContextAccessor) : ControllerBase
{
    private readonly DbSet<User> _users = context.Users;
    private readonly DbSet<RefreshToken> _refreshTokens = context.RefreshTokens;
    
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var user = _users
            .Include(user => user.UserRoles)
            .ThenInclude(user => user.Role)
            .Include(user => user.UserClaims)
            .FirstOrDefault(user => user.Email.Equals(request.Username));
   
        if (user is null || !passwordService.IsPasswordSuccessfulVerified(user.PasswordHash, request.Password))
        {
            return Unauthorized();
        }
    
        var accessToken = tokenService.CreateToken(user);
        var refreshTokenOutput = tokenService.CreateRefreshToken();
        
        var createdByIp = httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString() ?? string.Empty;
        var newRefreshToken = RefreshToken.Create(refreshTokenOutput.Token, user.Id, refreshTokenOutput.ExpiresAt, createdByIp);
        
        await _refreshTokens
            .Where(rf => rf.IsRevoked == false && rf.UserId == user.Id)
            .ForEachAsync(rf => rf.Revoke(createdByIp, accessToken.Token));
        
        await _refreshTokens.AddAsync(newRefreshToken);
        await context.SaveChangesAsync();
    
        tokenService.SetRefreshToken(Response, newRefreshToken.Token);  
        return Ok(new LoginResponse(accessToken.Token));
    }

    [HttpPost("logout")]
    public IActionResult Logout()
    {
        var refreshTokenFromCookie = Request.Cookies["refresh-token"];
        if (string.IsNullOrEmpty(refreshTokenFromCookie))
        {
            return NoContent();
        }
        
        var refreshToken = _refreshTokens.FirstOrDefault(t => t.Token.Equals(refreshTokenFromCookie));
        if (refreshToken is not null)
        {
            var revokedByIp = httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString() ?? string.Empty;
            refreshToken.Revoke(revokedByIp);
            _refreshTokens.Update(refreshToken);
            context.SaveChanges();
        }

        tokenService.RemoveRefreshToken(Response);

        return NoContent();
    }

    [HttpPost("refresh-token")]
    public IActionResult RenewAccessToken()
    {
        if (!Request.Cookies.TryGetValue("refresh-token", out var refreshTokenCookie))
        {
            return Unauthorized();
        }
 
        var existingRefreshToken = _refreshTokens
            .Include(x => x.User)
            .ThenInclude(x => x.UserRoles)
            .ThenInclude(x => x.Role)
            .Include(x => x.User)
            .ThenInclude(x => x.UserClaims)
            .FirstOrDefault(t => t.Token.Equals(refreshTokenCookie));
        
        /*
         * DOCUMENTAR REGRA DE REFRESH TOKEN .1
         * Se token recebido NÃO FOR ENCONTRADO ou NÃO estiver ATIVO:
         * Devolver 401 
         */
        if (existingRefreshToken is null || !existingRefreshToken.IsActive())
        {
            return Unauthorized();
        }
        
        var deviceIp = httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString() ?? string.Empty;

        /*
         * DOCUMENTAR REGRA DE REFRESH TOKEN .2
         * Se token recebido JÁ FOI REVOGADO E SUBSTITUÍDO:
         * Inativar todos tokens de forma recursiva para eliminar tentativa de possível ataque
         */
        
        if (existingRefreshToken is { IsRevoked: true, ReplacedByToken: not null })
        {
            RevokeDescendantsHandle(existingRefreshToken, deviceIp);
            context.SaveChanges();
            return Unauthorized();
        }

        var user = existingRefreshToken.User;
        var accessToken = tokenService.CreateToken(user);
        var refreshTokenOutput = tokenService.CreateRefreshToken();
        
        var newRefreshToken = RefreshToken.Create(refreshTokenOutput.Token, user.Id, refreshTokenOutput.ExpiresAt, deviceIp);
        _refreshTokens.Add(newRefreshToken);
        
        existingRefreshToken.Revoke(deviceIp, newRefreshToken.Token);
        context.SaveChanges();
    
        tokenService.SetRefreshToken(Response, newRefreshToken.Token);
        return Ok(new RefreshTokenResponse(accessToken.Token));
    }
    
    private void RevokeDescendantsHandle(RefreshToken refreshToken, string ipAddress)
    {
        if (string.IsNullOrEmpty(refreshToken.ReplacedByToken))
        {
            return;
        }
        
        var childToken = _refreshTokens.FirstOrDefault(x => x.Token == refreshToken.ReplacedByToken);
        if (childToken == null || !childToken.IsActive())
        {
            return;
        }
        
        childToken.Revoke(ipAddress, "Attempted reuse of ancestor token");
        _refreshTokens.Update(childToken);

        RevokeDescendantsHandle(childToken, ipAddress);
    }
}