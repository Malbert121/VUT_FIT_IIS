﻿using Microsoft.EntityFrameworkCore.Design;
using Microsoft.EntityFrameworkCore;


namespace Conventus.DAL.EfStructures
{
    public class ConventusDbContextFactory : IDesignTimeDbContextFactory<ConventusDbContext>
    {
        public ConventusDbContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<ConventusDbContext>();
            // Change To Your Server Name (I use my local custom)
            var connectionString = "Server=localhost;Database=Conventus;User Id=sa;Password=NewSecurePassword123!;TrustServerCertificate=True";
            optionsBuilder.UseSqlServer(connectionString);
            Console.WriteLine(connectionString);
            return new ConventusDbContext(optionsBuilder.Options);
        }
    }
}
