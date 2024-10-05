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
    }
}
