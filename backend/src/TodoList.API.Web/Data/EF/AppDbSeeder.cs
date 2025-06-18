using Microsoft.EntityFrameworkCore;
using TodoList.API.Web.Auth.Password;
using TodoList.API.Web.Models;

namespace TodoList.API.Web.Data.EF;

public static class AppDbSeeder 
{
    public static void DbSeed(this IApplicationBuilder app)
    {
        using var scope = app.ApplicationServices.CreateScope();
        
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var passwordService = scope.ServiceProvider.GetRequiredService<IPasswordService>();
        var env = app.ApplicationServices.GetRequiredService<IWebHostEnvironment>();
        
        var adminRole = Role.Create("Admin");
        var commonRole = Role.Create("Common");
        
        var adminUser = User.Create("Bruno", "admin@dotnet.com", passwordService.HashPassword("admin"));
        var commonUser = User.Create("César", "common@dotnet.com", passwordService.HashPassword("common"));
        
        var adminUserRole = UserRole.Create(adminUser.Id, adminRole.Id);
        var commonUserRole = UserRole.Create(commonUser.Id, commonRole.Id);

        var adminReadClaim = UserClaim.Create(adminUser.Id, "permissions", "CanRead");
        var adminWriteClaim = UserClaim.Create(adminUser.Id, "permissions", "CanWrite");
        var adminDeleteClaim = UserClaim.Create(adminUser.Id, "permissions", "CanDelete");
        var commonReadClaim = UserClaim.Create(commonUser.Id, "permissions", "CanRead");
        
        if (db.Users.Any())
        {
            return;
        }
        
        adminUser.AddUserClaim(adminReadClaim, adminDeleteClaim, adminWriteClaim);
        commonUser.AddUserClaim(commonReadClaim);
        
        db.Roles.AddRange(adminRole, commonRole);
        db.Users.AddRange(adminUser, commonUser);
        db.UserRoles.AddRange(adminUserRole, commonUserRole);
        db.UserClaims.AddRange(adminWriteClaim, adminDeleteClaim, adminReadClaim, commonReadClaim);
        
        db.SaveChanges();
    }
}