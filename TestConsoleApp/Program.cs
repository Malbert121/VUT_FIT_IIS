using DAL.Models;
namespace ConferenceManagement
{
    class Program
    {
        static void Main(string[] args)
        {
            // Create sample data
            List<User> users = CreateUsers();
            List<Conference> conferences = CreateConferences(users);
            FillConferenceDetails(conferences);

            // Display the conferences
            DisplayConferences(conferences);
        }

        static List<User> CreateUsers()
        {
            return new List<User>
            {
                new User { Id = 1, UserName = "admin", Email = "admin@example.com", IsAdmin = true },
                new User { Id = 2, UserName = "jdoe", Email = "jdoe@example.com", IsAdmin = false },
                new User { Id = 3, UserName = "asmith", Email = "asmith@example.com", IsAdmin = false }
            };
        }

        static List<Conference> CreateConferences(List<User> users)
        {
            return new List<Conference>
            {
                new Conference { Id = 1, Name = "Tech Conference 2024", Description = "Technology and innovation", Genre = "Tech", Location = "New York", StartDate = DateTime.Now.AddDays(30), EndDate = DateTime.Now.AddDays(32), Price = 100, Capacity = 200, Organizer = users[0] },
                new Conference { Id = 2, Name = "Business Summit", Description = "Annual Business Conference", Genre = "Business", Location = "London", StartDate = DateTime.Now.AddDays(60), EndDate = DateTime.Now.AddDays(61), Price = 150, Capacity = 150, Organizer = users[1] }
            };
        }

        static void FillConferenceDetails(List<Conference> conferences)
        {
            // Create rooms for the first conference
            var conference1 = conferences.First();
            var room1 = new Room { Id = 1, Name = "Main Hall", Capacity = 100 };
            var room2 = new Room { Id = 2, Name = "Room A", Capacity = 50 };

            // Create presentations for the first conference
            var presentation1 = new Presentation { Id = 1, Title = "AI Trends", Description = "Latest in AI technology", StartTime = DateTime.Now.AddDays(30).AddHours(10), EndTime = DateTime.Now.AddDays(30).AddHours(11), Room = room1, Speaker = conference1.Organizer };
            var presentation2 = new Presentation { Id = 2, Title = "Blockchain Basics", Description = "Introduction to Blockchain", StartTime = DateTime.Now.AddDays(30).AddHours(12), EndTime = DateTime.Now.AddDays(30).AddHours(13), Room = room2, Speaker = conference1.Organizer };

            // Add rooms and presentations to the conference
            conference1.Rooms = new List<Room> { room1, room2 };
            conference1.Presentations = new List<Presentation> { presentation1, presentation2 };
        }

        static void DisplayConferences(List<Conference> conferences)
        {
            foreach (var conference in conferences)
            {
                Console.WriteLine($"Conference: {conference.Name}");
                Console.WriteLine($"Description: {conference.Description}");
                Console.WriteLine($"Location: {conference.Location}");
                Console.WriteLine($"Dates: {conference.StartDate.ToShortDateString()} - {conference.EndDate.ToShortDateString()}");
                Console.WriteLine($"Price: ${conference.Price}");
                Console.WriteLine($"Capacity: {conference.Capacity}");

                // Display rooms
                Console.WriteLine("\nRooms:");
                foreach (var room in conference.Rooms)
                {
                    Console.WriteLine($"\tRoom: {room.Name} (Capacity: {room.Capacity})");
                }

                // Display presentations
                Console.WriteLine("\nPresentations:");
                foreach (var presentation in conference.Presentations)
                {
                    Console.WriteLine($"\tTitle: {presentation.Title}");
                    Console.WriteLine($"\tDescription: {presentation.Description}");
                    Console.WriteLine($"\tSpeaker: {presentation.Speaker.UserName}");
                    Console.WriteLine($"\tRoom: {presentation.Room.Name}");
                    Console.WriteLine($"\tTime: {presentation.StartTime.ToShortTimeString()} - {presentation.EndTime.ToShortTimeString()}\n");
                }

                Console.WriteLine("------------------------------------------------------\n");
            }
        }
    }

}