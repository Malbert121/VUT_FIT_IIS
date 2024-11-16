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

        public virtual User? GetUser(int id)
        => Context.Users.SingleOrDefault(u => u.Id == id);
        public virtual Conference? GetConference(int id)
        => Context.Conferences.SingleOrDefault(u => u.Id == id);


        public virtual int Update(Conference conference, bool persist=true)
        {
            Context.Conferences.Update(conference);
            return persist ? SaveChanges() : 0;
        }
    }
}
