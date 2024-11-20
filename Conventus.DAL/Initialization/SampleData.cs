using Conventus.Models.Entities;
using Conventus.Models.Enums;

namespace Conventus.DAL.Initialization
{
    public static class SampleData
    {
        // Sample Users
        public static List<User> Users => new()
        {
            new User
            {
                Id = 1,
                UserName = "xmalas04",
                Email = "xmalas04@vutb.cz",
                PasswordHash = "xmalas04@password".GetHashCode().ToString(), // Use proper password hashing in production
                Role = Role.Admin,
                OrganizedConferences = new List<Conference>(),
                Presentations = new List<Presentation>(),
                Reservations = new List<Reservation>()
            },
            new User
            {
                Id = 2,
                UserName = "jdoe",
                Email = "jdoe@example.com",
                PasswordHash = "jdoe@password".GetHashCode().ToString(), // Use proper password hashing in production
                Role = Role.User,
                OrganizedConferences = new List<Conference>(),
                Presentations = new List<Presentation>(),
                Reservations = new List<Reservation>()
            },
            new User
            {
                Id = 3,
                UserName = "asmith",
                Email = "asmith@example.com",
                PasswordHash = "asmith@password".GetHashCode().ToString(), // Use proper password hashing in production
                Role = Role.User,
                OrganizedConferences = new List<Conference>(),
                Presentations = new List<Presentation>(),
                Reservations = new List<Reservation>()
            }
        };

        // Sample Conferences
        public static List<Conference> Conferences => new()
        {
            new Conference
            {
                Id = 1,
                Name = "Tech Innovations 2024",
                Description = "A conference focusing on the latest trends and innovations in technology.",
                Genre = "Technology",
                Location = "Silicon Valley, CA",
                StartDate = new DateTime(2024, 5, 20),
                EndDate = new DateTime(2024, 5, 22),
                Price = 299.99m,
                Capacity = 200,
                Occupancy = 6,
                PhotoUrl = "path/to/location",
                Presentations = new List<Presentation>(),
                Reservations = new List<Reservation>(),
                Rooms = new List<Room>(),
                OrganizerId = 1,
            },
            new Conference
            {
                Id = 2,
                Name = "Health & Wellness Summit",
                Description = "A summit dedicated to health and wellness professionals.",
                Genre = "Health",
                Location = "New York City, NY",
                StartDate = new DateTime(2024, 6, 15),
                EndDate = new DateTime(2024, 6, 17),
                Price = 199.99m,
                Capacity = 150,
                Occupancy = 4,
                PhotoUrl = "path/to/location",
                Presentations = new List<Presentation>(),
                Reservations = new List<Reservation>(),
                Rooms = new List<Room>(),
                OrganizerId = 2,
            },
            new Conference
            {
                Id = 3,
                Name = "Future of Education",
                Description = "Exploring innovative approaches in education for the 21st century.",
                Genre = "Education",
                Location = "Chicago, IL",
                StartDate = new DateTime(2024, 7, 10),
                EndDate = new DateTime(2024, 7, 12),
                Price = 249.99m,
                Capacity = 300,
                Occupancy = 6,
                PhotoUrl = "path/to/location",
                Presentations = new List<Presentation>(),
                Reservations = new List<Reservation>(),
                Rooms = new List<Room>(),
                OrganizerId = 3,
            }
        };

        // Sample Rooms
        public static List<Room> Rooms => new()
        {
            new Room
            {
                Id = 1,
                Name = "Room A",
                Presentations = new List<Presentation>(),
                ConferenceId = 1
            },
            new Room
            {
                Id = 2,
                Name = "Room B",
                Presentations = new List<Presentation>(),
                ConferenceId = 2
            },
            new Room
            {
                Id = 3,
                Name = "Room C",
                Presentations = new List<Presentation>(),
                ConferenceId = 3
            }
        };

        // Sample Presentations
        public static List<Presentation> Presentations => new()
        {
           new Presentation
        {
            Id = 1,
            Title = "Advancements in AI Technology",
            Description = "Exploring the latest breakthroughs in Artificial Intelligence and how they will shape the future.",
            Tags = "AI, Innovation, Technology, Future",
            PhotoUrl = "https://example.com/photo1.jpg",
            StartTime = new DateTime(2024, 5, 20, 10, 0, 0), // May 20, 2024, 10:00 AM
            EndTime = new DateTime(2024, 5, 20, 11, 0, 0), // May 20, 2024, 11:00 AM
            RoomId = 1, // Assuming RoomId matches a Room entity
            SpeakerId = 1, // Linking to the third user as the speaker
            ConferenceId = 1, // Linking to the first conference
        },
        new Presentation
        {
            Id = 2,
            Title = "The Role of AI in Healthcare",
            Description = "A discussion on how AI is transforming healthcare, from diagnostics to personalized treatment.",
            Tags = "AI, Healthcare, Medicine, Technology",
            PhotoUrl = "https://example.com/photo2.jpg",
            StartTime = new DateTime(2024, 5, 20, 11, 0, 0), // May 20, 2024, 11:00 AM
            EndTime = new DateTime(2024, 5, 20, 12, 0, 0), // May 20, 2024, 12:00 PM
            RoomId = 2,
            SpeakerId = 2, 
            ConferenceId = 1,
        },
        new Presentation
        {
            Id = 3,
            Title = "Ethical Considerations in AI",
            Description = "An in-depth analysis of the ethical dilemmas surrounding AI, including bias and accountability.",
            Tags = "AI, Ethics, Society, Technology",
            PhotoUrl = "https://example.com/photo3.jpg",
            StartTime = new DateTime(2024, 5, 20, 12, 0, 0), // May 20, 2024, 12:00 PM
            EndTime = new DateTime(2024, 5, 20, 1, 0, 0), // May 20, 2024, 1:00 PM
            RoomId = 3, 
            SpeakerId = 3,
            ConferenceId = 1,
        },
        new Presentation
        {
            Id = 4,
            Title = "AI in Autonomous Vehicles",
            Description = "Exploring how AI is revolutionizing autonomous vehicles, making self-driving cars a reality.",
            Tags = "AI, Autonomous Vehicles, Transportation, Technology",
            PhotoUrl = "https://example.com/photo4.jpg",
            StartTime = new DateTime(2024, 5, 20, 13, 0, 0), // May 20, 2024, 1:00 PM
            EndTime = new DateTime(2024, 5, 20, 14, 0, 0), // May 20, 2024, 2:00 PM
            RoomId = 1,
            SpeakerId = 1, 
            ConferenceId = 1, 
        },
        new Presentation
        {
            Id = 5,
            Title = "Machine Learning in Data Science",
            Description = "An overview of how machine learning techniques are driving insights in the field of data science.",
            Tags = "ML, Data Science, AI, Technology",
            PhotoUrl = "https://example.com/photo5.jpg",
            StartTime = new DateTime(2024, 5, 20, 10, 0, 0), // May 20, 2023, 10:00 AM
            EndTime = new DateTime(2024, 5, 20, 11, 0, 0), // May 20, 2023, 11:00 AM
            RoomId = 2, 
            SpeakerId = 2, 
            ConferenceId = 1, 
        },
            new Presentation
            {
                Id = 6,
                Title = "Nutrition and Health",
                Description = "The importance of nutrition in maintaining good health.",
                Tags = "Health, Nutrition",
                PhotoUrl = "https://example.com/photo2.jpg",
                StartTime = new DateTime(2024, 6, 16, 9, 0, 0), // June 16, 2024, 9:00 AM
                EndTime = new DateTime(2024, 6, 16, 10, 0, 0), // June 16, 2024, 10:00 AM
                RoomId = 2, // Assuming RoomId matches a Room entity
               
                SpeakerId = 3, // Linking to the third user as the speaker
                
                ConferenceId = 2, // Linking to the second conference
              
            },
            new Presentation
            {
                Id = 7,
                Title = "Innovative Learning Techniques",
                Description = "Exploring modern approaches to education.",
                Tags = "Education, Innovation",
                PhotoUrl = "https://example.com/photo3.jpg",
                StartTime = new DateTime(2024, 7, 10, 14, 0, 0), // July 10, 2024, 2:00 PM
                EndTime = new DateTime(2024, 7, 10, 15, 0, 0), // July 10, 2024, 3:00 PM
                RoomId = 3, // Assuming RoomId matches a Room entity
               
                SpeakerId = 2, // Linking to the second user as the speaker
               
                ConferenceId = 3, // Linking to the third conference

            }
        };

        // Sample Reservations
        public static List<Reservation> Reservations => new()
        {
            new Reservation
            {
                Id = 1,
                UserId = 1, // Linking to the second user
                ConferenceId = 1, // Linking to the first conference
                IsConfirmed = true,
                IsPaid = true,
                NumberOfTickets = 2,
                Ammount = 100.0,
                ReservationDate = DateTime.Now,
            },
            new Reservation
            {
                Id = 2,
                UserId = 1, // Linking to the second user
                ConferenceId = 2, // Linking to the first conference
                IsConfirmed = false,
                IsPaid = true,
                NumberOfTickets = 2,
                Ammount = 100.0,
                ReservationDate = DateTime.Now,
            },
            new Reservation
            {
                Id = 3,
                UserId = 1, // Linking to the second user
                ConferenceId = 1, // Linking to the first conference
                IsConfirmed = false,
                IsPaid = false,
                NumberOfTickets = 2,
                Ammount = 100.0,
                ReservationDate = DateTime.Now,
            },
            new Reservation
            {
                Id = 4,
                UserId = 1, // Linking to the second user
                ConferenceId = 2, // Linking to the first conference
                IsConfirmed = false,
                IsPaid = false,
                NumberOfTickets = 2,
                Ammount = 100.0,
                ReservationDate = DateTime.Now,
            },
            // RESERVATIONS FOR USER 2
            new Reservation
            {
                Id = 5,
                UserId = 2, // Linking to the second user
                ConferenceId = 1, // Linking to the first conference
                IsConfirmed = true,
                IsPaid = true,
                NumberOfTickets = 2,
                Ammount = 100.0,
                ReservationDate = DateTime.Now,
            },
            new Reservation
            {
                Id = 6,
                UserId = 2, // Linking to the second user
                ConferenceId = 3, // Linking to the first conference
                IsConfirmed = false,
                IsPaid = true,
                NumberOfTickets = 2,
                Ammount = 100.0,
                ReservationDate = DateTime.Now,
            },
            new Reservation
            {
                Id = 7,
                UserId = 2, // Linking to the second user
                ConferenceId = 3, // Linking to the first conference
                IsConfirmed = false,
                IsPaid = false,
                NumberOfTickets = 2,
                Ammount = 100.0,
                ReservationDate = DateTime.Now,
            },
            new Reservation
            {
                Id = 8,
                UserId = 2, // Linking to the second user
                ConferenceId = 3, // Linking to the first conference
                IsConfirmed = false,
                IsPaid = false,
                NumberOfTickets = 2,
                Ammount = 100.0,
                ReservationDate = DateTime.Now,
            },
        };
    }
}
