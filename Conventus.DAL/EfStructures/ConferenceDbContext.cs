using Conventus.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace Conventus.DAL.EfStructures
{
    public class ConferenceDbContext : DbContext
    {
        public ConferenceDbContext(DbContextOptions<ConferenceDbContext> options)
            : base(options)
        {
        }
        public DbSet<Room> Rooms { get; set; }
        public DbSet<Reservation> Reservations { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Conference> Conferences { get; set; }
        public DbSet<Presentation> Presentations { get; set; }

    }
}
