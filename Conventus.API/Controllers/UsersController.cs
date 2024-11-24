using Azure.Core;
using Conventus.API.Controllers.Base;
using Conventus.DAL.Repositories.Interfaces;
using Conventus.Models.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using System.Text;
using Microsoft.AspNetCore.Authorization;

namespace Conventus.API.Controllers
{
    [Route("api/[controller]")]
    public class UsersController : BaseCrudController<User, UsersController>
    {

        public UsersController(IUserRepo userRepo) : base(userRepo)
        {

        }
        /// <summary>
        /// Gets all records
        /// </summary>
        /// <returns>All records</returns>
        /// <response code="200">Returns all items</response>
        [Produces("application/json")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [SwaggerResponse(200, "The execution was successful")]
        [SwaggerResponse(400, "The request was invalid")]
        [HttpGet("all")]
        public ActionResult<IEnumerable<User>> GetAllUsers()
        {
            return Ok(MainRepo.GetAll());
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
        [HttpGet("detail/{id}")]
        public ActionResult<User> GetDetailedUser(int id)
        {
            var entity = ((IUserRepo)MainRepo).Find(id);
            if (entity == null)
            {
                return NoContent();
            }
            return Ok(entity);
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
        [HttpGet("detail/admin/{id}")]
        public ActionResult<User> GetDetailedUserForAdmin(int id)
        {
            var entity = ((IUserRepo)MainRepo).Find(id);
            ((IUserRepo)MainRepo).SaveChanges();
            if (entity == null)
            {
                return NoContent();
            }
            entity.PasswordHash = Encoding.UTF8.GetString(Convert.FromBase64String(entity.PasswordHash));
            return Ok(entity);
        }


        /// <summary>
        /// Adds a single record
        /// </summary>
        /// <remarks>
        /// Sample body:
        /// <pre>
        /// {
        ///   "Id": 1,
        ///   "TimeStamp": "AAAAAAAAB+E="
        ///   "MakeId": 1,
        ///   "Color": "Black",
        ///   "PetName": "Zippy",
        ///   "MakeColor": "VW (Black)",
        /// }
        /// </pre>
        /// </remarks>
        /// <returns>Added record</returns>
        /// <response code="201">Found and updated the record</response>
        /// <response code="400">Bad request</response>
        [Produces("application/json")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [SwaggerResponse(201, "The execution was successful")]
        [SwaggerResponse(400, "The request was invalid")]
        [SwaggerResponse(409, "User already exists")]
        [HttpPost("post")]
        [Authorize]
        public ActionResult<User> AddUser([FromBody] User entity)
        {
            try
            {
                var ifExists = ((IUserRepo)MainRepo).FindByCondition(e => e.Email == entity.Email || e.UserName == entity.UserName, false);
                if (ifExists is null)
                {
                    entity.PasswordHash = Convert.ToBase64String(Encoding.UTF8.GetBytes(entity.PasswordHash));
                    ((IUserRepo)MainRepo).Add(entity);
                }
                else
                {
                    return Conflict(entity);
                }

            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }

            return CreatedAtAction(nameof(GetOne), new { id = entity.Id }, entity);
        }

        /// <summary>
        /// Updates a single record
        /// </summary>
        /// <remarks>
        /// Sample body:
        /// <pre>
        /// {
        ///   "Id": 1,
        ///   "TimeStamp": "AAAAAAAAB+E="
        ///   "MakeId": 1,
        ///   "Color": "Black",
        ///   "PetName": "Zippy",
        ///   "MakeColor": "VW (Black)",
        /// }
        /// </pre>
        /// </remarks>
        /// <param name="id">Primary key of the record to update</param>
        /// <returns>Single record</returns>
        /// <response code="200">Found and updated the record</response>
        /// <response code="400">Bad request</response>
        [Produces("application/json")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [SwaggerResponse(200, "The execution was successful")]
        [SwaggerResponse(400, "The request was invalid")]
        [SwaggerResponse(409, "User already exists")]
        [HttpPut("update/{id}")]
        [Authorize]
        public IActionResult UpdateUser(int id, [FromBody] User entity)
        {
            if (id != entity.Id)
            {
                return BadRequest();
            }
            try
            {
                var ifExists = ((IUserRepo)MainRepo).FindByCondition(e => (e.Email == entity.Email || e.UserName == entity.UserName) && e.Id != id, false);
                if (ifExists is null)
                {
                    entity.PasswordHash = Convert.ToBase64String(Encoding.UTF8.GetBytes(entity.PasswordHash));
                    ((IUserRepo)MainRepo).Update(entity);
                }
                else
                {
                    return Conflict(entity);
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }

            return Ok(entity);
        }


        /// <summary>
        /// Deletes a single record
        /// </summary>
        /// <remarks>
        /// Sample body:
        /// <pre>
        /// {
        ///   "Id": 1,
        ///   "TimeStamp": "AAAAAAAAB+E="
        /// }
        /// </pre>
        /// </remarks>
        /// <returns>Nothing</returns>
        /// <response code="200">Found and deleted the record</response>
        /// <response code="400">Bad request</response
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [SwaggerResponse(200, "The execution was successful")]
        [SwaggerResponse(400, "The request was invalid")]
        [HttpDelete("delete/{id}")]
        [Authorize]
        public ActionResult DeleteUser(int id)
        {
            var entity = ((IUserRepo)MainRepo).Find(id);
            if (entity is null || id != entity.Id)
            {
                return BadRequest();
            }
            try
            {
                ((IUserRepo)MainRepo).Delete(entity);
            }
            catch (Exception ex)
            {
                //Should handle more gracefully
                return new BadRequestObjectResult(ex.GetBaseException()?.Message);
            }

            return Ok();
        }

    }
}
