namespace TodoList.API.Web.Auth.Token;

public sealed class JwtSettings
{
    public string SecretKey { get; init; } = string.Empty;
    public string Issuer { get; init; } = string.Empty;
    public string Audience { get; init; } = string.Empty;
    public int AccessExpirationTimeInMinutes { get; init; }
    public int RefreshExpirationTimeInMinutes { get; init; }
};