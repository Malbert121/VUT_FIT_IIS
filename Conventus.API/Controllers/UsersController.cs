using Conventus.API.Controllers.Base;
using Conventus.DAL.Repositories.Interfaces;
using Conventus.Models.Entities;
using Microsoft.AspNetCore.Components;

namespace Conventus.API.Controllers
{
    [Route("api/[controller]")]
    public class UsersController : BaseCrudController<User, UsersController>
    {

        public UsersController(IUserRepo carRepo) : base(carRepo)
        {
        }

    }
}
