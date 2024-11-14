using Conventus.DAL.EfStructures;
using Conventus.DAL.Repositories.Base;
using Conventus.DAL.Repositories.Interfaces;
using Conventus.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace Conventus.DAL.Repositories
{
    public class PresentationRepo : BaseRepo<Presentation>,IPresentationRepo
    {
        public PresentationRepo(ConventusDbContext context) : base(context)
        {
        }
        internal PresentationRepo(DbContextOptions<ConventusDbContext> options) : base(options)
        {
        }

        public virtual User? GetUser(int id)
        => Context.Users.SingleOrDefault(u => u.Id == id);
        public virtual Conference? GetConference(int id)
        => Context.Conferences.SingleOrDefault(u => u.Id == id);
    }
}
