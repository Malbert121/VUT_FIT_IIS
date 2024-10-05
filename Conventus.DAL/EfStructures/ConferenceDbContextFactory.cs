using Microsoft.EntityFrameworkCore.Design;
using Microsoft.EntityFrameworkCore;


namespace Conventus.DAL.EfStructures
{
    public class ConferenceDbContextFactory : IDesignTimeDbContextFactory<ConferenceDbContext>
    {
        public ConferenceDbContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<ConferenceDbContext>();
            // Change To Your Server Name (I use my local custom)
            var connectionString = "Server=VLAD;Database=AutoLot;Trusted_Connection=True;TrustServerCertificate=True";
            optionsBuilder.UseSqlServer(connectionString);
            Console.WriteLine(connectionString);
            return new ConferenceDbContext(optionsBuilder.Options);
        }
    }
}
