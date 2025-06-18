using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TodoList.API.Web.Models;

namespace TodoList.API.Web.Data.Mapping;

public class UserRoleEntityMapping : IEntityTypeConfiguration<UserRole>
{
    public void Configure(EntityTypeBuilder<UserRole> builder)
    {
        builder.HasKey(config => new { config.UserId, config.RoleId });
        
        builder.HasOne(config => config.User)
            .WithMany(config => config.UserRoles)
            .HasForeignKey(config => config.UserId);
        
        builder.HasOne(config => config.Role)
            .WithMany(config => config.UserRoles)
            .HasForeignKey(config => config.RoleId);
    }
}