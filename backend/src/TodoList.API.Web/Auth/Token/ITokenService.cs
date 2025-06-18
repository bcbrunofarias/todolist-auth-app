using TodoList.API.Web.Models;

namespace TodoList.API.Web.Auth.Token;

public interface ITokenService
{
    RefreshTokenOutput CreateToken(User user);
    RefreshTokenOutput CreateRefreshToken();
    void SetRefreshToken(HttpResponse response, string token);
    void RemoveRefreshToken(HttpResponse response);
}