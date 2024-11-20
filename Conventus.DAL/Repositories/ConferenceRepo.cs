using Conventus.DAL.EfStructures;
using Conventus.DAL.Repositories.Base;
using Conventus.DAL.Repositories.Interfaces;
using Conventus.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace Conventus.DAL.Repositories
{
    public class ConferenceRepo : BaseRepo<Conference>, IConferenceRepo
    {
        public ConferenceRepo(ConventusDbContext context) : base(context)
        {
        }
        internal ConferenceRepo(DbContextOptions<ConventusDbContext> options) : base(options)
        {
        }
        /*        public override IEnumerable<Conference> GetAll()
                {
                    return Table
                .Include(c => c.Organizer)
                .Include(c => c.Presentations)
                .Include(c => c.Reservations);
                }*/
        public override Conference? Find(int? id)
        {
            if (id == null)
            {
                return null; // or handle as per your application's requirements
            }

            return Table
                .Include(o => o.Organizer) // Include the Organizer
                .Include(c => c.Presentations) // Include Presentations
                    .ThenInclude(p => p.Room) // Include Room for each Presentation
                .Include(c => c.Presentations) // Include Presentations again for Speaker inclusion
                    .ThenInclude(p => p.Speaker) // Include Speaker for each Presentation
                .Include(p => p.Rooms)
                .FirstOrDefault(c => c.Id == id); // Find the conference by ID

        }
        public override int Update(Conference entity, bool persist = true)
        {
            // Find the existing conference in the database
            var existingConference = Find(entity.Id);

            if (existingConference == null)
            {
                throw new Exception("Conference not found");
            }

            // Update basic fields of the conference
            existingConference.Name = entity.Name;
            existingConference.Genre = entity.Genre;
            existingConference.Location = entity.Location;
            existingConference.Price = entity.Price;
            existingConference.Capacity = entity.Capacity;
            existingConference.StartDate = entity.StartDate;
            existingConference.EndDate = entity.EndDate;
            existingConference.Description = entity.Description;

            // Handle rooms: Update existing ones, create new ones, or delete removed ones
            // First, update existing or add new rooms
            foreach (var room in entity.Rooms)
            {
                // If the room has an ID, it already exists and should be updated
                if (room.Id != 0)
                {
                    var existingRoom = existingConference.Rooms.FirstOrDefault(r => r.Id == room.Id);
                    if (existingRoom != null)
                    {
                        // Update the room properties
                        existingRoom.Name = room.Name;
                    }
                }
                else
                {
                    // If the room doesn't have an ID, it's new and should be added
                    room.ConferenceId = entity.Id;  // Associate the room with the conference
                    existingConference.Rooms.Add(room);
                }
            }

            // Now remove any rooms that were removed from the new list
            var roomIdsInUpdate = entity.Rooms.Select(r => r.Id).ToList();
            var roomsToRemove = existingConference.Rooms
                .Where(r => !roomIdsInUpdate.Contains(r.Id))
                .ToList();

            foreach (var room in roomsToRemove)
            {
                existingConference.Rooms.Remove(room);
            }

            // Mark the conference as updated in the database
            Table.Update(existingConference);

            // Save changes to the database if 'persist' is true
            return persist ? Context.SaveChanges() : 0;
        }

    }
}
