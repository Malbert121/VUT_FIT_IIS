using Conventus.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace Conventus.DAL.EfStructures
{
    public class ConventusDbContext : DbContext
    {
        public ConventusDbContext(DbContextOptions<ConventusDbContext> options)
            : base(options)
        {
        }
        public DbSet<Room> Rooms { get; set; }
        public DbSet<Reservation> Reservations { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Conference> Conferences { get; set; }
        public DbSet<Presentation> Presentations { get; set; }

        //TODO : Fluent API
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Fluent API configuration for Conference entity
            modelBuilder.Entity<Conference>(builder =>
            {
                // Table name
                builder.ToTable("Conferences");

                // Primary key
                builder.HasKey(c => c.Id);

                // Properties
                builder.Property(c => c.Name)
                    .IsRequired()
                    .HasMaxLength(100);

                builder.Property(c => c.Description)
                    .HasMaxLength(1000);

                builder.Property(c => c.Genre)
                    .IsRequired()
                    .HasMaxLength(50);

                builder.Property(c => c.Location)
                    .IsRequired()
                    .HasMaxLength(200);

                builder.Property(c => c.StartDate)
                    .IsRequired()
                    .HasColumnType("datetime2");

                builder.Property(c => c.EndDate)
                    .IsRequired()
                    .HasColumnType("datetime2");

                builder.Property(c => c.Price)
                    .HasColumnType("decimal(18,2)");

                builder.Property(c => c.Capacity)
                    .IsRequired();

                builder.Property(c => c.Occupancy)
                    .IsRequired();

                builder.Property(c => c.PhotoUrl)
                    .HasMaxLength(500);

                builder.HasMany(c => c.Presentations)
                     .WithOne()
                     .HasForeignKey(p => p.ConferenceId)
                     .OnDelete(DeleteBehavior.Cascade);

                builder.HasMany(c => c.Reservations)
                      .WithOne()
                      .HasForeignKey(r => r.ConferenceId)
                      .OnDelete(DeleteBehavior.Cascade);

                builder.HasMany(c => c.Rooms)
                    .WithOne()
                    .HasForeignKey(r => r.ConferenceId)
                    .OnDelete(DeleteBehavior.Cascade);

                builder.HasOne(c => c.Organizer)
                      .WithMany()
                      .HasForeignKey(c => c.OrganizerId)
                      .OnDelete(DeleteBehavior.Restrict); // Maybe Cascade
            });
            // Configuration for Presentation entity
            modelBuilder.Entity<Presentation>(builder =>
            {
                // Primary Key
                builder.HasKey(p => p.Id); // Assuming Id is defined in BaseEntity

                // Properties configuration
                builder.Property(p => p.Title)
                    .IsRequired()
                    .HasMaxLength(100); // Adjust length as necessary

                builder.Property(p => p.Description)
                    .HasMaxLength(500); // Adjust length as necessary

                builder.Property(p => p.Tags)
                    .HasMaxLength(250); // Adjust length as necessary

                builder.Property(p => p.PhotoUrl)
                    .HasMaxLength(500); // Adjust length as necessary

                builder.Property(p => p.StartTime)
                    .IsRequired();

                builder.Property(p => p.EndTime)
                    .IsRequired();

                // Relationships configuration
                builder.HasOne(p => p.Room)
                    .WithMany(r => r.Presentations) // Assuming Room has a collection of Presentations
                    .HasForeignKey(p => p.RoomId)
                    .OnDelete(DeleteBehavior.Restrict);

                builder.HasOne(p => p.Speaker)
                    .WithMany(u => u.Presentations) // Assuming User has a collection of Presentations
                    .HasForeignKey(p => p.SpeakerId)
                    .OnDelete(DeleteBehavior.Restrict); // Adjust behavior as needed

                builder.HasOne(p => p.Conference)
                    .WithMany(c => c.Presentations) // Assuming Conference has a collection of Presentations
                    .HasForeignKey(p => p.ConferenceId)
                    .OnDelete(DeleteBehavior.Cascade); // Adjust behavior as needed
            });
            // Configuration for Reservation entity
            modelBuilder.Entity<Reservation>(builder =>
            {
                // Primary Key
                builder.HasKey(r => r.Id); // Assuming Id is defined in BaseEntity

                // Properties configuration
                builder.Property(r => r.UserId)
                    .IsRequired();

                builder.Property(r => r.ConferenceId)
                    .IsRequired();

                builder.Property(r => r.IsConfirmed)
                    .IsRequired();

                builder.Property(r => r.IsPaid)
                    .IsRequired();

                builder.Property(r => r.NumberOfTickets)
                    .IsRequired()
                    .HasDefaultValue(1); // Default value can be adjusted

                builder.Property(r => r.Ammount)
                    .IsRequired();

                builder.Property(r => r.ReservationDate)
                    .IsRequired();

                // Relationships configuration
                builder.HasOne(r => r.User)
                    .WithMany(u => u.Reservations) // Assuming User has a collection of Reservations
                    .HasForeignKey(r => r.UserId)
                    .OnDelete(DeleteBehavior.Cascade); // Adjust behavior as needed

                builder.HasOne(r => r.Conference)
                    .WithMany(c => c.Reservations) // Assuming Conference has a collection of Reservations
                    .HasForeignKey(r => r.ConferenceId)
                    .OnDelete(DeleteBehavior.Cascade); // Adjust behavior as needed
            });
            // Configuration for Room entity
            modelBuilder.Entity<Room>(builder =>
            {
                // Primary Key
                builder.HasKey(r => r.Id); // Assuming Id is defined in BaseEntity

                // Properties configuration
                builder.Property(r => r.Name)
                    .IsRequired()
                    .HasMaxLength(100); // Adjust length as necessary

                builder.Property(r => r.Capacity)
                    .IsRequired();

                // Relationships configuration
                builder.HasMany(r => r.Presentations)
                    .WithOne(p => p.Room) // Assuming Presentation has a Room navigation property
                    .HasForeignKey(p => p.RoomId) // Assuming RoomId is a property in Presentation
                    .OnDelete(DeleteBehavior.Restrict);  // Maybe Restrict (but check logic with conferences CASCADE)

                builder.HasOne(r => r.Conference)
                    .WithMany(c => c.Rooms) // Assuming Conference has a collection of Rooms
                    .HasForeignKey(r => r.ConferenceId)
                    .OnDelete(DeleteBehavior.Cascade); // Adjust behavior as needed
            });
            // Configuration for Reservation entity
            modelBuilder.Entity<Reservation>(builder =>
            {
                // Primary Key
                builder.HasKey(r => r.Id); // Assuming Id is defined in BaseEntity

                // Properties configuration
                builder.Property(r => r.UserId)
                    .IsRequired();

                builder.Property(r => r.ConferenceId)
                    .IsRequired();

                builder.Property(r => r.IsConfirmed)
                    .IsRequired();

                builder.Property(r => r.IsPaid)
                    .IsRequired();

                builder.Property(r => r.NumberOfTickets)
                    .IsRequired()
                    .HasDefaultValue(1); // Default value can be adjusted

                builder.Property(r => r.ReservationDate)
                    .IsRequired();

                // Relationships configuration
                builder.HasOne(r => r.User)
                    .WithMany(u => u.Reservations)
                    .HasForeignKey(r => r.UserId)
                    .OnDelete(DeleteBehavior.Restrict); // Changed to Restrict

                builder.HasOne(r => r.Conference)
                    .WithMany(c => c.Reservations)
                    .HasForeignKey(r => r.ConferenceId)
                    .OnDelete(DeleteBehavior.Cascade); // This can remain Cascade if appropriate
            });
            modelBuilder.Entity<User>(builder =>
            {
                // Set table name if different from class name
                builder.ToTable("Users");

                // Set properties
                builder.HasKey(u => u.Id); // Assuming Id is the primary key from BaseEntity
                builder.Property(u => u.UserName)
                    .IsRequired()
                    .HasMaxLength(50); // Set max length according to your requirements
                builder.Property(u => u.Email)
                    .IsRequired()
                    .HasMaxLength(100); // Adjust length as necessary
                builder.Property(u => u.PasswordHash)
                    .IsRequired();

                // Configure relationships
                builder.HasMany(u => u.OrganizedConferences)
                    .WithOne(c => c.Organizer) // Assuming Conference has an Organizer property of type User
                    .HasForeignKey(c => c.OrganizerId);

                builder.HasMany(u => u.Presentations)
                    .WithOne(p => p.Speaker) // Assuming Presentation has a Speaker property of type User
                    .HasForeignKey(p => p.SpeakerId);

                builder.HasMany(u => u.Reservations)
                    .WithOne(r => r.User) // Assuming Reservation has a User property of type User
                    .HasForeignKey(r => r.UserId);
            });

            // Additional Fluent API configurations can be added here for other entities
        }
    }
}

