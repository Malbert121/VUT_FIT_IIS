using Conventus.DAL.Repositories.Base;
using Conventus.Models.Entities;
using Microsoft.EntityFrameworkCore.Update.Internal;
namespace Conventus.DAL.Repositories.Interfaces
{
    public interface IReservationRepo : IRepo<Reservation>
    {

        public User? GetUser(int id);
        public Conference? GetConference(int id);
        public int Update(Conference conference, bool persist = true);
    }
}
