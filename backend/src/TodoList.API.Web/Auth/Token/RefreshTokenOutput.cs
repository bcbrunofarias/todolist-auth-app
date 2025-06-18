namespace TodoList.API.Web.Auth.Token;

public record RefreshTokenOutput(string Token, DateTime ExpiresAt);