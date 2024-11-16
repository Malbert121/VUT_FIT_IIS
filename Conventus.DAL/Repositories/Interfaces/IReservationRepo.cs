using Conventus.DAL.Repositories.Base;
using Conventus.Models.Entities;
namespace Conventus.DAL.Repositories.Interfaces
{
    public interface IReservationRepo : IRepo<Reservation>
    {
        public IEnumerable<Reservation> GetGuest();  // will more specify with users
        public IEnumerable<Reservation> GetByPaid(bool flag);    // will more specify with users
        public IEnumerable<Reservation> GetByСonfirm(bool flag);    // will more specify with users

        public bool UpdatePay(List<int> reservationsIds, bool flag);
        public bool UpdateConfirm(List<int> reservationsIds, bool flag);

    }
}
