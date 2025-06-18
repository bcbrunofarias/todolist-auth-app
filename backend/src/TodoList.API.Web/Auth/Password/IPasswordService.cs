namespace TodoList.API.Web.Auth.Password;

public interface IPasswordService
{
    string HashPassword(string password);
    bool IsPasswordSuccessfulVerified(string hashedPassword, string providedPassword);
}