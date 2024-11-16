using Conventus.DAL.Repositories.Base;
using Conventus.Models.Entities;

namespace Conventus.DAL.Repositories.Interfaces
{
    public interface IPresentationRepo : IRepo<Presentation>
    {
        public User? GetUser(int id);
        public Conference? GetConference(int id);
    }
}
