using Conventus.DAL.EfStructures;
using Conventus.DAL.Repositories.Base;
using Conventus.DAL.Repositories.Interfaces;
using Conventus.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace Conventus.DAL.Repositories
{
    public class ReservationRepo : BaseRepo<Reservation>,IReservationRepo
    {
        public ReservationRepo(ConventusDbContext context) : base(context)
        {
        }
        internal ReservationRepo(DbContextOptions<ConventusDbContext> options) : base(options)
        {
        }
    }
}
