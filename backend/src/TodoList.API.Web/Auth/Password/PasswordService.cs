using Microsoft.AspNetCore.Identity;

namespace TodoList.API.Web.Auth.Password;

public sealed class PasswordService : IPasswordService
{
    private readonly PasswordHasher<object> _hasher = new();
    
    public string HashPassword(string password)
    {
        return _hasher.HashPassword(null!, password);
    }

    public bool IsPasswordSuccessfulVerified(string hashedPassword, string providedPassword)
    {
        var result = _hasher.VerifyHashedPassword(null!, hashedPassword, providedPassword);
        return result == PasswordVerificationResult.Success;
    }
}