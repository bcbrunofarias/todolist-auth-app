
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using TodoList.API.Web.Models;

namespace TodoList.API.Web.Auth.Token;

public sealed class TokenService(IOptions<JwtSettings> jwtOptions) : ITokenService
{
    private readonly JwtSettings _jwtSettings = jwtOptions.Value;
    
    public RefreshTokenOutput CreateToken(User user)
    {
        var claims = new List<Claim>()
        {
            new(JwtRegisteredClaimNames.Name, user.Name),
            new(JwtRegisteredClaimNames.Email, user.Email),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };
        
        claims.AddRange(user.UserRoles.Select(r => new Claim("roles", r.Role.Name)));
        claims.AddRange(user.UserClaims.Select(c => new Claim(c.Type, c.Value)));

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.SecretKey));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var expiresAt = DateTime.UtcNow.AddMinutes(_jwtSettings.AccessExpirationTimeInMinutes);
        
        var jwt = new JwtSecurityToken(
            issuer:  _jwtSettings.Issuer,
            audience: _jwtSettings.Audience,
            notBefore: DateTime.UtcNow,
            expires: expiresAt,
            claims: claims,
            signingCredentials: credentials);

        var token = new JwtSecurityTokenHandler().WriteToken(jwt);
        return new RefreshTokenOutput(token, expiresAt);
    }

    public RefreshTokenOutput CreateRefreshToken()
    {
        var expiresAt = DateTime.UtcNow.AddMinutes(_jwtSettings.RefreshExpirationTimeInMinutes);
        var token = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));
        return new RefreshTokenOutput(token, expiresAt);
    }

    public void SetRefreshToken(HttpResponse response, string token)
    {
        var cookieOptions = new CookieOptions()
        {
            HttpOnly = true,
            Secure = false,                                 // true (require https)
            SameSite = SameSiteMode.Lax,                    // Strict
            Expires = DateTimeOffset.UtcNow.AddMinutes(_jwtSettings.RefreshExpirationTimeInMinutes),
            Path = "/"                                      // /api/auth/refresh-token
        };
        
        response.Cookies.Append("refresh-token", token, cookieOptions);
    }

    public void RemoveRefreshToken(HttpResponse response)
    {
        response.Cookies.Delete("refresh-token");
    }
}