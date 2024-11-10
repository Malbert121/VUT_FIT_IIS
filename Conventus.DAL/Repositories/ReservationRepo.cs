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
        public virtual IEnumerable<Reservation> GetGuestReservations()
            => Table;
        public virtual IEnumerable<Reservation> GetReservationsByPaid(bool flag)
            => Table.Where(r => r.IsPaid==flag);
        public IEnumerable<Reservation> GetReservationsByСonfirm(bool flag)
            => Table.Where(r=>r.IsConfirmed==flag);
    }
}
