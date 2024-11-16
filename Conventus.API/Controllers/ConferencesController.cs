using Conventus.API.Controllers.Base;
using Conventus.DAL.Repositories.Interfaces;
using Conventus.Models.Entities;
//using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using System.Collections.Generic;

namespace Conventus.API.Controllers
{
    [Route("api/[controller]")]
    public class ConferencesController : BaseCrudController<Conference, ConferencesController>
    {

        public ConferencesController(IConferenceRepo conferenceRepo) : base(conferenceRepo)
        {
        }
        /// <summary>
        /// Gets a single record
        /// </summary>
        /// <param name="id">Primary key of the record</param>
        /// <returns>Single record</returns>
        /// <response code="200">Found the record</response>
        /// <response code="204">No content</response>
        [Produces("application/json")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [SwaggerResponse(200, "The execution was successful")]
        [SwaggerResponse(204, "No content")]
        [HttpGet("myConferences")]
        public ActionResult<IEnumerable<Conference>> GetConferencesByUser([FromQuery] int user_id)
        {
            var entity = MainRepo.GetAll().Where(e=>e.OrganizerId==user_id);

            if (entity == null)
            {
                return NoContent();
            }

            return Ok(entity);
        }
    }
}
