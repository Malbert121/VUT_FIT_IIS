using Conventus.API.Controllers.Base;
using Conventus.DAL.Repositories.Interfaces;
using Conventus.Models.Entities;
using Microsoft.AspNetCore.Components;

namespace Conventus.API.Controllers
{
    [Route("api/[controller]")]
    public class ConferencesController : BaseCrudController<Conference, ConferencesController>
    {

        public ConferencesController(IConferenceRepo conferenceRepo) : base(conferenceRepo)
        {
        }

    }
}
