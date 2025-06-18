using Microsoft.EntityFrameworkCore;

namespace TodoList.API.Web.Data.EF;

public static class AppDbInit
{
    public static void DbInitialize(this IApplicationBuilder builder)
    {
        var db = builder.ApplicationServices.GetRequiredService<AppDbContext>();
        var env = builder.ApplicationServices.GetRequiredService<IWebHostEnvironment>();

        if (env.IsDevelopment()) return;
        
        db.Database.Migrate();
    }
}