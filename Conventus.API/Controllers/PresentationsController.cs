using Conventus.API.Controllers.Base;
using Conventus.DAL.Repositories.Interfaces;
using Conventus.Models.Entities;
using Microsoft.AspNetCore.Components;

namespace Conventus.API.Controllers
{
    [Route("api/[controller]")]
    public class PresentationsController : BaseCrudController<Presentation, PresentationsController>
    {

        public PresentationsController(IPresentationRepo presentationRepo) : base(presentationRepo)
        {
        }

    }
}
