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
            var connectionString = "Server=tcp:sqldb-conventus.database.windows.net,1433;Initial Catalog=db-conventus;Persist Security Info=False;User ID=xpopov10;Password=*Evergreen567+;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=100;";
            optionsBuilder.UseSqlServer(connectionString);
            Console.WriteLine(connectionString);
            return new ConventusDbContext(optionsBuilder.Options);
        }
    }
}
