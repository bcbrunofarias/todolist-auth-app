using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TodoList.API.Web.Models;

namespace TodoList.API.Web.Data.Mapping;

public class RefreshTokenEntityMapping : IEntityTypeConfiguration<RefreshToken>
{
    public void Configure(EntityTypeBuilder<RefreshToken> builder)
    {
        
        builder.HasKey(config => config.Id);

        builder.Property(config => config.Token)
            .HasMaxLength(500)
            .IsRequired();

        builder.Property(config => config.CreatedByIp)
            .HasMaxLength(80);
        
        builder.Property(config => config.RevokedByIp)
            .HasMaxLength(80);
       
        builder.Property(config => config.ReplacedByToken)
            .HasMaxLength(500);
        
        builder.HasOne(config => config.User)
            .WithMany(config => config.RefreshTokens)
            .HasForeignKey(config => config.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}