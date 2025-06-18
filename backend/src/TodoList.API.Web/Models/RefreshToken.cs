namespace TodoList.API.Web.Models;

public class RefreshToken
{
    public Guid Id { get; private set; }
    public Guid UserId { get; private set; }
    public User User { get; private set; } = null!;
    public string Token { get; private set; } = string.Empty;
    public DateTime CreatedAt { get; init; } = DateTime.UtcNow;
    public DateTime ExpiresAt { get; private init; }
    public bool IsRevoked { get; private set; }
    public DateTime? RevokedAt { get; private set; }
    public string? ReplacedByToken { get; private set; }
    public string? CreatedByIp { get; private set; }
    public string? RevokedByIp { get; private set; }

    
    public static RefreshToken Create(string token, Guid userId, DateTime expiresAt, string createdByIp)
    {
        return new RefreshToken()
        {
            Id = Guid.NewGuid(),
            Token = token,
            UserId = userId,
            ExpiresAt = expiresAt,
            CreatedByIp = createdByIp
        };
    }

    public void Revoke(string revokedByIp, string? revokedByToken = null)
    {
        IsRevoked = true;
        RevokedAt = DateTime.UtcNow;
        RevokedByIp = revokedByIp;
        ReplacedByToken = revokedByToken;
    }

    public bool IsActive()
    {
        return !IsRevoked && ExpiresAt > DateTime.UtcNow;
    }
}