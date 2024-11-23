using Microsoft.EntityFrameworkCore.Design;
using Microsoft.EntityFrameworkCore;


namespace Conventus.DAL.EfStructures
{
    public class ConventusDbContextFactory : IDesignTimeDbContextFactory<ConventusDbContext>
    {
        public ConventusDbContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<ConventusDbContext>();
            // Change To Your Server Name (I use my local custom)
            var connectionString = "Server=sqlserver,1433;Database=Conventus;User Id=sa;Password=xkukht01@password;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=100;";
            optionsBuilder.UseSqlServer(connectionString);
            Console.WriteLine(connectionString);
            return new ConventusDbContext(optionsBuilder.Options);
        }
    }
}
