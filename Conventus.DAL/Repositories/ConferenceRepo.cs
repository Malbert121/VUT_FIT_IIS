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
    }
}
