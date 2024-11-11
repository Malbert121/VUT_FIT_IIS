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
        public virtual IEnumerable<Reservation> GetGuest()
            => Table;
        public virtual IEnumerable<Reservation> GetByPaid(bool flag)
            => Table.Where(r => r.IsPaid==flag);
        public IEnumerable<Reservation> GetByСonfirm(bool flag)
            => Table.Where(r=>r.IsConfirmed==flag);

        public virtual bool UpdatePay(List<int> reservationsIds, bool flag)
        {
            
            var reservationsToUpdate = Table.Where(r=>reservationsIds.Contains(r.Id)).ToList();
            if(!reservationsToUpdate.Any())
            {
                return false;
            }
            
            foreach(var reservation in reservationsToUpdate)
            {
                reservation.IsPaid = flag;
            }
            UpdateRange(reservationsToUpdate);
            return true;
        }

        public virtual bool UpdateConfirm(List<int> reservationsIds, bool flag)
        {
            var reservationsToUpdate = Table.Where(r => reservationsIds.Contains(r.Id)).ToList();
            if (!reservationsToUpdate.Any())
            {
                return false;
            }

            foreach (var reservation in reservationsToUpdate)
            {
                reservation.IsConfirmed = flag;
            }
            UpdateRange(reservationsToUpdate);
            return true;
        }
    }
}
