﻿using Azure.Core;
using Conventus.Models.Entities;
using Conventus.Models.Enums;
using System.Text;

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
                PasswordHash = Convert.ToBase64String(Encoding.UTF8.GetBytes("xmalas04@password")), // Use proper password hashing in production
                Role = Role.Admin,
                OrganizedConferences = new List<Conference>(),
                Presentations = new List<Presentation>(),
                Reservations = new List<Reservation>()
            },
            new User
            {
                Id = 2,
                UserName = "science2",
                Email = "science1@example.com",
                PasswordHash = Convert.ToBase64String(Encoding.UTF8.GetBytes("science1@password")), // Use proper password hashing in production
                Role = Role.User,
                OrganizedConferences = new List<Conference>(),
                Presentations = new List<Presentation>(),
                Reservations = new List<Reservation>()
            },
            new User
            {
                Id = 3,
                UserName = "education1",
                Email = "education1@example.com",
                PasswordHash = Convert.ToBase64String(Encoding.UTF8.GetBytes("education1@password")), // Use proper password hashing in production
                Role = Role.User,
                OrganizedConferences = new List<Conference>(),
                Presentations = new List<Presentation>(),
                Reservations = new List<Reservation>()
            },
            new User
            {
                Id = 4,
                UserName = "education2",
                Email = "education2@example.com",
                PasswordHash = Convert.ToBase64String(Encoding.UTF8.GetBytes("education2@password")), // Use proper password hashing in production
                Role = Role.User,
                OrganizedConferences = new List<Conference>(),
                Presentations = new List<Presentation>(),
                Reservations = new List<Reservation>()
            },
            new User
            {
                Id = 5,
                UserName = "myron",
                Email = "myron@gmail.com",
                PasswordHash = Convert.ToBase64String(Encoding.UTF8.GetBytes("myron@password")), // Use proper password hashing in production
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
                Name = "Tech Innovations 2025",
                Description = "A conference focusing on the latest trends and innovations in technology.",
                Genre = "Technology",
                Location = "Silicon Valley, CA",
                StartDate = new DateTime(2025, 5, 20),
                EndDate = new DateTime(2025, 5, 22),
                Price = 100.00m,
                Capacity = 200,
                Occupancy = 12,
                PhotoUrl = "https://www.wirelesscs.com/storage/app/public/qlOBU7mb4M0CGJb7mtqCfKQoJr5j6u-metaMV9xa2ZUdlZVTXRSeTBvanFUUXRrVzZRLnBuZw==-.png",
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
                StartDate = new DateTime(2025, 6, 15),
                EndDate = new DateTime(2025, 6, 17),
                Price = 50.00m,
                Capacity = 150,
                Occupancy = 12,
                PhotoUrl = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyypFc5gJPv_YKYx-fbz7F6qLPXHz1tWBUaw&s",
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
                ConferenceId = 1
            },
            new Room
            {
                Id = 3,
                Name = "Room C",
                Presentations = new List<Presentation>(),
                ConferenceId = 2
            },
            new Room
            {
                Id = 4,
                Name = "Room D",
                Presentations = new List<Presentation>(),
                ConferenceId = 2
            }
        };

        // Sample Presentations
        public static List<Presentation> Presentations => new()
        {
            // Tech conf
            new Presentation
            {
                Id = 1,
                Title = "Exploring the Cosmos: New Discoveries in Astronomy",
                Description = "Exploring the Cosmos: New Discoveries in Astronomy.",
                Tags = "Сosmos, Astronomy, Future",
                PhotoUrl = "https://example.com/photo1.jpg",
                StartTime = new DateTime(2025, 5, 20, 10, 0, 0),
                EndTime = new DateTime(2025, 5, 20, 12, 0, 0),
                RoomId = 1, // Assuming RoomId matches a Room entity
                SpeakerId = 1, // Linking to the third user as the speaker
                ConferenceId = 1, // Linking to the first conference
            },
            new Presentation
            {
                Id = 2,
                Title = "The Ethics of Genetic Engineering: Opportunities and Challenges",
                Description = "The Ethics of Genetic Engineering: Opportunities and Challenges.",
                Tags = "Science,Biology, Genetic, Future",
                PhotoUrl = "https://example.com/photo1.jpg",
                StartTime = new DateTime(2025, 5, 20, 10, 0, 0),
                EndTime = new DateTime(2025, 5, 20, 12, 0, 0),
                RoomId = 2, // Assuming RoomId matches a Room entity
                SpeakerId = 2, // Linking to the third user as the speaker
                ConferenceId = 1, // Linking to the first conference
            },
            new Presentation
            {
                Id = 3,
                Title = "Climate Change and the Role of Science in Mitigating Its Effects",
                Description = "Climate Change and the Role of Science in Mitigating Its Effects.",
                Tags = "Сlimat, Warm, Water, Science, Future",
                PhotoUrl = "https://example.com/photo1.jpg",
                StartTime = new DateTime(2025, 5, 21, 10, 0, 0),
                EndTime = new DateTime(2025, 5, 21, 12, 0, 0),
                RoomId = 1, // Assuming RoomId matches a Room entity
                SpeakerId = 1, // Linking to the third user as the speaker
                ConferenceId = 1, // Linking to the first conference
            },
            new Presentation
            {
                Id = 4,
                Title = "Artificial Intelligence: Transforming Science and Society",
                Description = "Artificial Intelligence: Transforming Science and Society.",
                Tags = "IT, AI, Science, Society",
                PhotoUrl = "https://example.com/photo1.jpg",
                StartTime = new DateTime(2025, 5, 21, 10, 0, 0),
                EndTime = new DateTime(2025, 5, 21, 12, 0, 0),
                RoomId = 2, // Assuming RoomId matches a Room entity
                SpeakerId = 2, // Linking to the third user as the speaker
                ConferenceId = 1, // Linking to the first conference
            },
            new Presentation
            {
                Id = 5,
                Title = "Quantum Computing: Unlocking the Next Frontier",
                Description = "Quantum Computing: Unlocking the Next Frontier.",
                Tags = "IT, Quantum",
                PhotoUrl = "https://example.com/photo1.jpg",
                StartTime = new DateTime(2025, 5, 21, 17, 0, 0),
                EndTime = new DateTime(2025, 5, 21, 19, 0, 0),
                RoomId = 1, // Assuming RoomId matches a Room entity
                SpeakerId = 1, // Linking to the third user as the speaker
                ConferenceId = 1, // Linking to the first conference
            },

            // Health conf
            new Presentation
            {
                Id = 6,
                Title = "The Science of Nutrition: Eating for a Better Tomorrow",
                Description = "The Science of Nutrition: Eating for a Better Tomorrow",
                Tags = "Science, Nutrition, Health, Food",
                PhotoUrl = "https://example.com/photo1.jpg",
                StartTime = new DateTime(2025, 6, 15, 10, 0, 0),
                EndTime = new DateTime(2025, 6, 15, 12, 0, 0),
                RoomId = 3, // Assuming RoomId matches a Room entity
                SpeakerId = 3, // Linking to the third user as the speaker
                ConferenceId = 2, // Linking to the first conference
            },
            new Presentation
            {
                Id = 7,
                Title = "Mental Health Matters: Reducing the Stigma and Improving Care",
                Description = "Mental Health Matters: Reducing the Stigma and Improving Care.",
                Tags = "Mental, Health",
                PhotoUrl = "https://example.com/photo1.jpg",
                StartTime = new DateTime(2025, 6, 15, 10, 0, 0),
                EndTime = new DateTime(2025, 6, 15, 12, 0, 0),
                RoomId = 4, // Assuming RoomId matches a Room entity
                SpeakerId = 4, // Linking to the third user as the speaker
                ConferenceId = 2, // Linking to the first conference
            },
            new Presentation
            {
                Id = 8,
                Title = "Preventive Healthcare: A Pathway to Longevity",
                Description = "Preventive Healthcare: A Pathway to Longevity.",
                Tags = "Health",
                PhotoUrl = "https://example.com/photo1.jpg",
                StartTime = new DateTime(2025, 6, 16, 10, 0, 0),
                EndTime = new DateTime(2025, 6, 16, 12, 0, 0),
                RoomId = 3, // Assuming RoomId matches a Room entity
                SpeakerId = 3, // Linking to the third user as the speaker
                ConferenceId = 2, // Linking to the first conference
            },
            new Presentation
            {
                Id = 9,
                Title = "Fitness in the 21st Century: Balancing Technology and Physical Activity",
                Description = "Fitness in the 21st Century: Balancing Technology and Physical Activity.",
                Tags = "Technology, Health, Activity, Fitness",
                PhotoUrl = "https://example.com/photo1.jpg",
                StartTime = new DateTime(2025, 6, 16, 10, 0, 0),
                EndTime = new DateTime(2025, 6, 16, 12, 0, 0),
                RoomId = 4, // Assuming RoomId matches a Room entity
                SpeakerId = 4, // Linking to the third user as the speaker
                ConferenceId = 2, // Linking to the first conference
            },
            new Presentation
            {
                Id = 10,
                Title = "The Future of Medicine: Personalized Healthcare Solutions",
                Description = "The Future of Medicine: Personalized Healthcare Solutions.",
                Tags = "Health, Medicine",
                PhotoUrl = "https://example.com/photo1.jpg",
                StartTime = new DateTime(2025, 6, 16, 17, 0, 0),
                EndTime = new DateTime(2025, 6, 16, 19, 0, 0),
                RoomId = 4, // Assuming RoomId matches a Room entity
                SpeakerId = 3, // Linking to the third user as the speaker
                ConferenceId = 2, // Linking to the first conference
            },
        };

        // Sample Reservations
        public static List<Reservation> Reservations => new()
        {
            // user 1
            new Reservation
            {
                Id = 1,
                UserId = 1, // Linking to the second user
                ConferenceId = 2, // Linking to the first conference
                IsConfirmed = false,
                IsPaid = false,
                NumberOfTickets = 1,
                Ammount = 50.0,
                ReservationDate = DateTime.Now,
            },
            new Reservation
            {
                Id = 2,
                UserId = 1, // Linking to the second user
                ConferenceId = 2, // Linking to the first conference
                IsConfirmed = false,
                IsPaid = true,
                NumberOfTickets = 1,
                Ammount = 50.0,
                ReservationDate = DateTime.Now,
            },
            new Reservation
            {
                Id = 3,
                UserId = 1, // Linking to the second user
                ConferenceId = 2, // Linking to the first conference
                IsConfirmed = true,
                IsPaid = true,
                NumberOfTickets = 2,
                Ammount = 100.0,
                ReservationDate = DateTime.Now,
            },

            // user 2
            new Reservation
            {
                Id = 4,
                UserId = 2, // Linking to the second user
                ConferenceId = 2, // Linking to the first conference
                IsConfirmed = false,
                IsPaid = false,
                NumberOfTickets = 1,
                Ammount = 50.0,
                ReservationDate = DateTime.Now,
            },
            new Reservation
            {
                Id = 5,
                UserId = 2, // Linking to the second user
                ConferenceId = 2, // Linking to the first conference
                IsConfirmed = false,
                IsPaid = true,
                NumberOfTickets = 1,
                Ammount = 50.0,
                ReservationDate = DateTime.Now,
            },
            new Reservation
            {
                Id = 6,
                UserId = 2, // Linking to the second user
                ConferenceId = 2, // Linking to the first conference
                IsConfirmed = true,
                IsPaid = true,
                NumberOfTickets = 2,
                Ammount = 100.0,
                ReservationDate = DateTime.Now,
            },

            // user 3
            new Reservation
            {
                Id = 7,
                UserId = 3, // Linking to the second user
                ConferenceId = 1, // Linking to the first conference
                IsConfirmed = false,
                IsPaid = false,
                NumberOfTickets = 1,
                Ammount = 100.0,
                ReservationDate = DateTime.Now,
            },
            new Reservation
            {
                Id = 8,
                UserId = 3, // Linking to the second user
                ConferenceId = 1, // Linking to the first conference
                IsConfirmed = false,
                IsPaid = true,
                NumberOfTickets = 1,
                Ammount = 100.0,
                ReservationDate = DateTime.Now,
            },
            new Reservation
            {
                Id = 9,
                UserId = 2, // Linking to the second user
                ConferenceId = 1, // Linking to the first conference
                IsConfirmed = true,
                IsPaid = true,
                NumberOfTickets = 2,
                Ammount = 200.0,
                ReservationDate = DateTime.Now,
            },


            // user 4
            new Reservation
            {
                Id = 10,
                UserId = 4, // Linking to the second user
                ConferenceId = 1, // Linking to the first conference
                IsConfirmed = false,
                IsPaid = false,
                NumberOfTickets = 1,
                Ammount = 100.0,
                ReservationDate = DateTime.Now,
            },
            new Reservation
            {
                Id = 11,
                UserId = 4, // Linking to the second user
                ConferenceId = 1, // Linking to the first conference
                IsConfirmed = false,
                IsPaid = true,
                NumberOfTickets = 1,
                Ammount = 100.0,
                ReservationDate = DateTime.Now,
            },
            new Reservation
            {
                Id = 12,
                UserId = 4, // Linking to the second user
                ConferenceId = 1, // Linking to the first conference
                IsConfirmed = true,
                IsPaid = true,
                NumberOfTickets = 2,
                Ammount = 200.0,
                ReservationDate = DateTime.Now,
            },

            // user 5
            new Reservation
            {
                Id = 13,
                UserId = 5, // Linking to the second user
                ConferenceId = 1, // Linking to the first conference
                IsConfirmed = false,
                IsPaid = false,
                NumberOfTickets = 1,
                Ammount = 100.0,
                ReservationDate = DateTime.Now,
            },
            new Reservation
            {
                Id = 14,
                UserId = 5, // Linking to the second user
                ConferenceId = 1, // Linking to the first conference
                IsConfirmed = false,
                IsPaid = true,
                NumberOfTickets = 1,
                Ammount = 100.0,
                ReservationDate = DateTime.Now,
            },
            new Reservation
            {
                Id = 15,
                UserId = 5, // Linking to the second user
                ConferenceId = 1, // Linking to the first conference
                IsConfirmed = true,
                IsPaid = true,
                NumberOfTickets = 2,
                Ammount = 200.0,
                ReservationDate = DateTime.Now,
            },
            new Reservation
            {
                Id = 16,
                UserId = 5, // Linking to the second user
                ConferenceId = 2, // Linking to the first conference
                IsConfirmed = false,
                IsPaid = false,
                NumberOfTickets = 1,
                Ammount = 50.0,
                ReservationDate = DateTime.Now,
            },
            new Reservation
            {
                Id = 17,
                UserId = 5, // Linking to the second user
                ConferenceId = 2, // Linking to the first conference
                IsConfirmed = false,
                IsPaid = true,
                NumberOfTickets = 1,
                Ammount = 50.0,
                ReservationDate = DateTime.Now,
            },
            new Reservation
            {
                Id = 18,
                UserId = 5, // Linking to the second user
                ConferenceId = 2, // Linking to the first conference
                IsConfirmed = true,
                IsPaid = true,
                NumberOfTickets = 2,
                Ammount = 100.0,
                ReservationDate = DateTime.Now,
            },
        };
    }
}
