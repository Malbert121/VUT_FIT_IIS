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
    }
    
}
