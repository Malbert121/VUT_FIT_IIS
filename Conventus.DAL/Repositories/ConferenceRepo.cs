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
                .FirstOrDefault(c => c.Id == id); // Find the conference by ID
        }
    }
}
