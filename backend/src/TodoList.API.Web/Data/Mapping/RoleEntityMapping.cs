using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TodoList.API.Web.Models;

namespace TodoList.API.Web.Data.Mapping;

public class RoleEntityMapping : IEntityTypeConfiguration<Role>
{
    public void Configure(EntityTypeBuilder<Role> builder)
    {
        builder.HasKey(config => config.Id);
        
        builder.Property(config => config.Name)
            .HasMaxLength(100)
            .IsRequired();
    }
}