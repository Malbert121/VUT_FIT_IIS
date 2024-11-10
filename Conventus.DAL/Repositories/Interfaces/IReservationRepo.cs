using Conventus.DAL.Repositories.Base;
using Conventus.Models.Entities;
namespace Conventus.DAL.Repositories.Interfaces
{
    public interface IReservationRepo : IRepo<Reservation>
    {
        public IEnumerable<Reservation> GetGuestReservations();  // will more specify with users
        public IEnumerable<Reservation> GetReservationsByPaid(bool flag);    // will more specify with users
        public IEnumerable<Reservation> GetReservationsByСonfirm(bool flag);    // will more specify with users

    }
}
