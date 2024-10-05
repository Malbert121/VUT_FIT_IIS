using Conventus.DAL.EfStructures;
using Conventus.DAL.Repositories.Base;
using Conventus.DAL.Repositories.Interfaces;
using Conventus.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace Conventus.DAL.Repositories
{
    public class RoomRepo : BaseRepo<Room>,IRoomRepo
    {
        public RoomRepo(ConventusDbContext context) : base(context)
        {
        }
        internal RoomRepo(DbContextOptions<ConventusDbContext> options) : base(options)
        {
        }
    }
}
