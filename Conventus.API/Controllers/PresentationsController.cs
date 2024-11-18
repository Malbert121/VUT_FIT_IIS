using Conventus.API.Controllers.Base;
using Conventus.DAL.Repositories.Interfaces;
using Conventus.Models.Entities;
using Conventus.Models.Enums;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;

namespace Conventus.API.Controllers
{
    [Route("api/[controller]")]
    public class PresentationsController : BaseCrudController<Presentation, PresentationsController>
    {

        public PresentationsController(IPresentationRepo presentationRepo) : base(presentationRepo)
        {
        }

        /// <summary>
        /// Creates a new presentation for a specified conference.
        /// </summary>
        /// <param name="user_id">The ID of the user creating the presentation.</param>
        /// <param name="presentation">The presentation details to create.</param>
        /// <returns>A message indicating the result of the create operation.</returns>
        /// <response code="200">Successfully created the specified presentation.</response>
        /// <response code="400">The request body is invalid or missing required presentation details.</response>
        /// <response code="500">An internal server error occurred.</response>
        [Produces("application/json")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [SwaggerResponse(200, "Successfully created the specified presentation.")]
        [SwaggerResponse(400, "Invalid request: missing or invalid presentation data.")]
        [SwaggerResponse(500, "Internal error.")]
        [HttpPost("create")]
        public ActionResult<string> CreatePresentation([FromQuery] int user_id, [FromBody] Presentation presentation)
        {
            try
            {
                User? user = ((IPresentationRepo)MainRepo).GetUser(user_id);  // check user
                if (user == null)
                {
                    return BadRequest("Unknown user.");
                }
                
                if (presentation == null)  // check requested obj
                {
                    return BadRequest("Reservation should not be empty.");
                }

                Conference? conference = ((IPresentationRepo)MainRepo).GetConference(presentation.ConferenceId);  // check conference
                if(conference == null)
                {
                    return BadRequest("Unexist or unknown conference.");
                }
                
                if (conference.Presentations.Any(p => p.Title == presentation.Title))  // check uniq of presentation
                {
                    return BadRequest($"Already exist presentation wiht title {presentation.Title} for conference {conference.Name}");
                }

                if (!conference.Rooms.Any(r => r.Id == presentation.RoomId))  // check room
                {
                    return BadRequest("Unexist or unknown room.");
                }

                if (presentation.StartTime > presentation.EndTime)  // check confict in start/end
                {
                    return BadRequest($"Incorrect time diaposon from {presentation.StartTime} to {presentation.EndTime} for new presentation");
                }

                if (conference.Presentations.Any(p => p.RoomId == presentation.RoomId && p.StartTime < presentation.StartTime && p.EndTime > presentation.EndTime))  // check confilict with ather presentation in the same room
                {
                    return BadRequest("Already exist lectures in the same time interval and room");
                }

                // create new data
                var newPresentation = new Presentation
                {
                    Title = presentation.Title,
                    Description = presentation.Description,
                    Tags = presentation.Tags,
                    StartTime = presentation.StartTime,
                    EndTime = presentation.EndTime,
                    RoomId = presentation.RoomId,
                    SpeakerId = presentation.SpeakerId,
                    ConferenceId = presentation.ConferenceId,
                };

                ((IPresentationRepo)MainRepo).Add(newPresentation);

                return Ok("Successfully created the reservation");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}\n{ex.StackTrace}");
                return Problem("Internal error");
            }
        }

        /// <summary>
        /// Get all presentations where current use is speaker.
        /// </summary>
        /// <param name="user_id">The ID of speaker.</param>
        /// <returns>A message indicating the result of the create operation.</returns>
        /// <response code="200">Successfully get presentations.</response>
        /// <response code="400">The request body is invalid or missing required presentation details.</response>
        /// <response code="500">An internal server error occurred.</response>
        [Produces("application/json")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [SwaggerResponse(200, "Successfully created the specified presentation.")]
        [SwaggerResponse(400, "Invalid request: missing or invalid presentation data.")]
        [SwaggerResponse(500, "Internal error.")]
        [HttpGet("my_presentations")]
        public ActionResult<string> GetMyPresentations([FromQuery] int user_id)
        {
            try
            {
                User? user = ((IPresentationRepo)MainRepo).GetUser(user_id);  // check user
                if (user == null)
                {
                    return BadRequest("Unknown user.");
                }

                if (user.Role == Role.Admin)
                {
                    return Ok(((IPresentationRepo)MainRepo).GetAll());
                }
                return Ok(((IPresentationRepo)MainRepo).GetAll().Where(p=>p.SpeakerId == user_id));
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}\n{ex.StackTrace}");
                return Problem("Internal error");
            }
        }



        /// <summary>
        /// Deletes the specified presentations based on their IDs.
        /// </summary>
        /// <param name="user_id">The ID of the user requesting deletion.</param>
        /// <param name="presentationsIds">List of presentation IDs to delete.</param>
        /// <returns>A message indicating the result of the delete operation.</returns>
        /// <response code="200">Successfully deleted the specified presentations.</response>
        /// <response code="400">The request is invalid or missing required data (e.g., empty list of presentation IDs).</response>
        /// <response code="404">One or more presentations were not found, or the user is not authorized to delete them.</response>
        /// <response code="500">An internal server error occurred.</response>
        [Produces("application/json")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [SwaggerResponse(200, "Successfully deleted the specified presentations.")]
        [SwaggerResponse(400, "Invalid request: presentation IDs list is empty or missing.")]
        [SwaggerResponse(404, "One or more presentations not found or user lacks permission to delete them.")]
        [SwaggerResponse(500, "Internal server error.")]
        [HttpDelete("delete")]
        public ActionResult<string> DeletePresentations([FromQuery] int user_id, [FromBody] List<int> presentationsIds)
        {
            try
            {

                User? user = ((IReservationRepo)MainRepo).GetUser(user_id);  // check user
                if (user == null)
                {
                    return BadRequest($"Unknown user");
                }

                if (presentationsIds == null || !presentationsIds.Any())  // check input array
                {
                    return BadRequest("Presentations should not be empty.");
                }

                var presentationsToDelete = ((IPresentationRepo)MainRepo).GetRange(presentationsIds).ToList();  // check input data in db
                if (!presentationsToDelete.Any())
                { 
                    return NotFound("Not found presentations"); 
                }
                
                if (!presentationsToDelete.All(p => p.SpeakerId == user_id || p.Conference.OrganizerId == user_id) && (user.Role != Role.Admin))  // check rights
                { 
                    return NotFound($"User don`t have to CRUD action with requested reservations."); 
                }

                ((IPresentationRepo)MainRepo).DeleteRange(presentationsToDelete);  // delete
                return Ok("Successfully deleted reservations.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}\n{ex.StackTrace}");
                return Problem("Internal error");
            }
        }

        /// <summary>
        /// Updates the specified presentation based on provided details.
        /// </summary>
        /// <param name="user_id">The ID of the user requesting the update.</param>
        /// <param name="presentation">The presentation object containing updated details.</param>
        /// <returns>A message indicating the result of the update operation.</returns>
        /// <response code="200">Successfully updated the specified presentation.</response>
        /// <response code="400">Invalid request: missing or invalid fields in the presentation data.</response>
        /// <response code="404">Presentation or related entities (conference, room) not found or user not authorized.</response>
        /// <response code="500">An internal server error occurred.</response>
        [Produces("application/json")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [SwaggerResponse(200, "Successfully updated the specified presentation.")]
        [SwaggerResponse(400, "Invalid request: presentation data is missing or contains invalid fields.")]
        [SwaggerResponse(404, "Presentation or related entities (conference, room) not found, or user is not authorized to update.")]
        [SwaggerResponse(500, "Internal server error.")]
        [HttpPut("update")]
        public ActionResult<string> UpdatePresentation([FromQuery] int user_id, [FromBody] Presentation presentation)
        {
            try
            {
                User? user = ((IPresentationRepo)MainRepo).GetUser(user_id);  // check user
                if (user == null)
                {
                    return BadRequest("Unknown user.");
                }

                if (presentation == null)  // check requested obj
                {
                    return BadRequest("Reservation should not be empty.");
                }

                Presentation? presentationToUpdate = ((IPresentationRepo)MainRepo).Find(presentation.Id);  // check existing
                if (presentationToUpdate == null)
                {
                    return BadRequest("Unexist or unknown presentation.");
                }
                
                Conference? conference = ((IPresentationRepo)MainRepo).GetConference(presentation.ConferenceId);  // check conference
                if (conference == null)
                {
                    return BadRequest("Unexist or unknown conference.");
                }

                if (presentationToUpdate.ConferenceId != presentation.ConferenceId)  // restriction
                {
                    return BadRequest("Forbidden change conference for presentation");
                }

                if (!conference.Rooms.Any(r => r.Id == presentation.RoomId))  // check room
                {
                    return BadRequest("Unexist or unknown room.");
                }


                if (presentation.StartTime > presentation.EndTime)  // check confict in start/end
                {
                    return BadRequest($"Incorrect time diaposon from {presentation.StartTime} to {presentation.EndTime} for new presentation");
                }

                if (conference.Presentations.Any(p => p.RoomId == presentation.RoomId && p.StartTime < presentation.StartTime && p.EndTime > presentation.EndTime))  // check confilict with ather presentation in the same room
                {
                    return BadRequest("Already exist lectures in the same time interval and room");
                }

                // update data
                presentationToUpdate.Title = presentation.Title;
                presentationToUpdate.Description = presentation.Description;
                presentationToUpdate.Tags = presentation.Tags;
                presentation.RoomId = presentation.RoomId;
                presentationToUpdate.SpeakerId = presentation.SpeakerId;
                presentationToUpdate.StartTime = presentation.StartTime;
                presentationToUpdate.EndTime = presentation.EndTime;

                ((IPresentationRepo)MainRepo).Update(presentationToUpdate);  // update

                return Ok("Successfully created the reservation");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}\n{ex.StackTrace}");
                return Problem("Internal error");
            }
        }
    }
}
