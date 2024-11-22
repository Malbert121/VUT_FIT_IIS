using Conventus.DAL.EfStructures;
using Conventus.DAL.Repositories.Base;
using Conventus.DAL.Repositories.Interfaces;
using Conventus.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace Conventus.DAL.Repositories
{
    public class UserRepo : BaseRepo<User>, IUserRepo
    {
        public UserRepo(ConventusDbContext context) : base(context)
        {
        }
        internal UserRepo(DbContextOptions<ConventusDbContext> options) : base(options)
        {
        }

        public override User? Find(int? id)
        {
            if (id == null)
            {
                return null; // or handle as per your application's requirements
            }

            return Table
                .Include(user => user.OrganizedConferences) // Include the Organizer // Include Room for each Presentation
                .Include(c => c.Presentations) // Include Presentations again for Speaker  // Include Speaker for each Presentation
                .Include(c => c.Reservations) // Include Presentations
                .FirstOrDefault(c => c.Id == id); // Find the conference by ID
        }
    }
    
}
