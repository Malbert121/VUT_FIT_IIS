using Conventus.API.Controllers.Base;
using Conventus.DAL.Repositories.Interfaces;
using Conventus.Models.Entities;
using Conventus.Models.Enums;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;


namespace Conventus.API.Controllers
{
    [Route("api/[controller]")]
    public class ReservationsController : BaseCrudController<Reservation, ReservationsController>
    {
        public ReservationsController(IReservationRepo reservationRepo) : base(reservationRepo)
        {

        }

        /// <summary>
        /// Retrieves all unpaid reservations for a specific user.
        /// </summary>
        /// <param name="user_id">The ID of the user whose unpaid reservations are being retrieved.</param>
        /// <param name="paid">Boolean flag for filtering out data based on their paid status.</param>
        /// <returns>All unpaid reservations for the specified user.</returns>
        /// <response code="200">Returns a list of unpaid reservations</response>
        /// <response code="400">Invalid user ID or request parameters</response>
        /// <response code="500">Internal server error</response>
        [Produces("application/json")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [SwaggerResponse(200, "Returns a list of unpaid reservations")]
        [SwaggerResponse(400, "Invalid user ID or request parameters")]
        [SwaggerResponse(500, "Internal server error")]
        [HttpGet("my")]
        public ActionResult<IEnumerable<Reservation>> GetMyReservations([FromQuery] int user_id, [FromQuery] bool paid) // TODO: add user context
        {
            try
            {
                User? user = ((IReservationRepo)MainRepo).GetUser(user_id);
                if (user == null)
                {
                    return BadRequest($"Unknown user.");
                }
                if (user.Role == Role.Admin)
                {
                    return Ok(((IReservationRepo)MainRepo).GetAll().Where(r =>r.IsPaid==paid));
                }
                return Ok(((IReservationRepo)MainRepo).GetAll().Where(r => r.IsPaid==paid && r.UserId == user_id));
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}\n{ex.StackTrace}");
                return Problem("Internal error.");
            }
        }

        /// <summary>
        /// Retrieves all guest reservations for a specific user.
        /// </summary>
        /// <param name="user_id">The ID of the user whose guest reservations are being retrieved.</param>
        /// <param name="paid">Boolean flag for filtering out data based on their paid status.</param>
        /// <returns>All guest reservations for the specified user.</returns>
        /// <response code="200">Returns a list of guest reservations</response>
        /// <response code="400">Invalid user ID or request parameters</response>
        /// <response code="500">Internal server error</response>
        [Produces("application/json")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [SwaggerResponse(200, "Returns a list of guest reservations")]
        [SwaggerResponse(400, "Invalid user ID or request parameters")]
        [SwaggerResponse(500, "Internal server error")]
        [HttpGet("guest")]
        public ActionResult<IEnumerable<Reservation>> GetGuestReservations([FromQuery] int user_id, [FromQuery] bool paid) // TODO: add user context
        {
            try
            {
                User? user = ((IReservationRepo)MainRepo).GetUser(user_id);
                if (user == null)
                {
                    return BadRequest($"Unknown user.");
                }
                if (user.Role == Role.Admin)
                {
                    return Ok(((IReservationRepo)MainRepo).GetAll().Where(r => r.IsPaid == paid));
                }
                return Ok(((IReservationRepo)MainRepo).GetAll().Where(r => r.IsPaid == paid && r.Conference.OrganizerId == user_id));
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}\n{ex.StackTrace}");
                return Problem("Internal error.");
            }
        }

        /// <summary>
        /// Update status of reservations to paid.
        /// </summary>
        /// <param name="reservationsIds">List of reservation IDs to update.</param>
        /// <returns>Confirmation message indicating the result of the update operation.</returns>
        /// <response code="200">Successfully updated the reservations</response>
        /// <response code="400">The users authontification error, request body was invalid or empty</response>
        /// <response code="404">No reservations found to update</response>
        /// <response code="500">Internal error</response>
        [Produces("application/json")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [SwaggerResponse(200, "Successfully updated the reservations")]
        [SwaggerResponse(400, "The request body was invalid or empty")]
        [SwaggerResponse(404, "No reservations found to update")]
        [SwaggerResponse(500, "Internal error.")]
        [HttpPut("to_pay")]
        public ActionResult<string> PutReservationsToPaid([FromBody]List<int> reservationsIds, [FromQuery] int user_id) // TODO: add user context
        {
            try
            {
                User? user = ((IReservationRepo)MainRepo).GetUser(user_id);
                if (user == null)
                {
                    return BadRequest($"Unknown user.");
                }

                if (reservationsIds == null || !reservationsIds.Any())
                {
                    return BadRequest("Reservations should not be empty.");
                }

                var reservationsToUpdate = ((IReservationRepo)MainRepo).GetRange(reservationsIds).ToList();
                if (!reservationsToUpdate.Any())
                { 
                    return NotFound("Not found reservations."); 
                }
                
                if ((user.Role != Role.Admin) && (!reservationsToUpdate.All(r => r.UserId == user.Id)))
                {
                    return BadRequest($"User don`t have to CRUD action with requested reservations.");
                }

                foreach (var reservation in reservationsToUpdate)
                { 
                    reservation.IsPaid = true; 
                }
                
                ((IReservationRepo)MainRepo).UpdateRange(reservationsToUpdate);
                return Ok("Ok.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}\n{ex.StackTrace}");
                return Problem("Internal error");
            }
        }

        /// <summary>
        /// Update status of reservation with confirmation.
        /// </summary>
        /// <param name="user_id">The ID of the user who makes the request.</param>
        /// <param name="flag">Boolean flag indicating the confirmation status to set (true for confirmed, false for unconfirmed).</param>
        /// <param name="reservationsIds">List of reservation IDs to update.</param>
        /// <returns>Confirmation message indicating the result of the update operation.</returns>
        /// <response code="200">Successfully updated the reservations</response>
        /// <response code="400">The request body was invalid or empty</response>
        /// <response code="404">No reservations found to update</response>
        /// <response code="500">Internal error</response>
        [Produces("application/json")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [SwaggerResponse(200, "Successfully updated the reservations")]
        [SwaggerResponse(400, "The request body was invalid or empty")]
        [SwaggerResponse(404, "No reservations found to update")]
        [SwaggerResponse(500, "Internal error.")]
        [HttpPut("to_confirm")]
        public ActionResult<string> PutReservationsToConfirm([FromQuery] int user_id, [FromQuery] bool flag,[FromBody] List<int> reservationsIds) // TODO: add user context
        {
            try
            {
                User? user = ((IReservationRepo)MainRepo).GetUser(user_id);
                if (user == null)
                {
                    return BadRequest($"Unknown user");
                }

                if (reservationsIds == null || !reservationsIds.Any())
                {
                    return BadRequest("Reservations should not be empty");
                }

                var reservationsToUpdate = ((IReservationRepo)MainRepo).GetRange(reservationsIds).ToList();
                if (!reservationsToUpdate.Any())
                { 
                    return NotFound("Not found reservations"); 
                }
                
                if ((user.Role != Role.Admin) && (!reservationsToUpdate.All(r => r.Conference.OrganizerId == user.Id)))
                {
                    return BadRequest($"User don`t have to CRUD action with requested reservations.");
                }

                foreach (var reservation in reservationsToUpdate)
                { 
                    reservation.IsConfirmed = flag; 
                }

                ((IReservationRepo)MainRepo).UpdateRange(reservationsToUpdate);
                return Ok("Ok");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}\n{ex.StackTrace}");
                return Problem("Internal error");
            }
        }

        /// <summary>
        /// Create a new reservation.
        /// </summary>
        /// <param name="reservation">Reservation details to create.</param>
        /// <returns>A message indicating the result of the create operation.</returns>
        /// <response code="200">Successfully created the specified reservation.</response>
        /// <response code="400">The request body is invalid or empty (e.g., missing reservation IDs).</response>
        /// <response code="500">An internal server error occurred.</response>
        [Produces("application/json")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [SwaggerResponse(200, "Successfully created the specified reservation.")]
        [SwaggerResponse(400, "Invalid request: missing or invalid reservation data.")]
        [SwaggerResponse(500, "Internal error.")]
        [HttpPost("create")]
        public ActionResult<string> CreateReservation([FromBody] Reservation reservation, [FromQuery] int user_id)
        {
            try
            {
                bool payFlag = false;
                bool confirmFlag = false;

                User? user = ((IReservationRepo)MainRepo).GetUser(user_id);
                if (user == null)
                {
                    return BadRequest($"Unknown user.");
                }

                if (reservation == null)
                {
                    return BadRequest("Reservation should not be empty.");
                }

                var conference = ((IReservationRepo)MainRepo).GetConference(reservation.ConferenceId);
                if(conference == null)
                {
                    return BadRequest($"Unknown conference with id {reservation.ConferenceId}.");
                }

                if (conference.Occupancy + reservation.NumberOfTickets > conference.Capacity)
                {
                    return BadRequest("The requested number of tickets exceeds the number of available seats");
                }

                if(conference.OrganizerId == user_id) 
                {
                    payFlag = true;
                    confirmFlag = true;
                }

                var new_reservation = new Reservation{
                    UserId = reservation.UserId,
                    ConferenceId = conference.Id,
                    IsConfirmed = confirmFlag,
                    IsPaid = payFlag,
                    NumberOfTickets=reservation.NumberOfTickets,
                    Ammount = (double)conference.Price*reservation.NumberOfTickets,
                    ReservationDate = reservation.ReservationDate,
                };

                conference.Occupancy += new_reservation.NumberOfTickets;

                ((IReservationRepo)MainRepo).Add(new_reservation);
                ((IReservationRepo)MainRepo).Update(conference);

                return Ok("Successfully created the reservation");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}\n{ex.StackTrace}");
                return Problem("Internal error");
            }
        }

        /// <summary>
        /// Deletes specified reservations based on their IDs.
        /// </summary>
        /// <param name="reservationsIds">List of reservation IDs to delete.</param>
        /// <returns>A message indicating the result of the delete operation.</returns>
        /// <response code="200">Successfully deleted the specified reservations.</response>
        /// <response code="400">The request body is invalid or empty (e.g., missing reservation IDs).</response>
        /// <response code="404">No reservations found with the provided IDs or user is not authorized to delete them.</response>
        /// <response code="500">An internal server error occurred.</response>
        [Produces("application/json")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [SwaggerResponse(200, "Successfully deleted the specified reservations.")]
        [SwaggerResponse(400, "Invalid request: reservation IDs list is empty or missing.")]
        [SwaggerResponse(404, "No reservations found with the specified IDs or user is not authorized to delete them.")]
        [SwaggerResponse(500, "Internal error.")]
        [HttpDelete("delete")]
        public ActionResult<string> DeleteReservations([FromBody] List<int> reservationsIds, [FromQuery] int user_id)
        {
            try
            {

                User? user = ((IReservationRepo)MainRepo).GetUser(user_id);
                if (user == null)
                {
                    return BadRequest($"Unknown user.");
                }

                if (reservationsIds == null || !reservationsIds.Any())
                {
                    return BadRequest("Reservations should not be empty.");
                }

                var reservationsToUpdate = ((IReservationRepo)MainRepo).GetRange(reservationsIds).ToList();
                if (!reservationsToUpdate.Any())
                { return NotFound("Not found reservations"); }
                if(!reservationsToUpdate.All(r=>r.UserId == user_id) && !reservationsToUpdate.All(r => r.Conference.OrganizerId == user_id) && (user.Role != Role.Admin)) // TODO: add admin
                { return NotFound($"User don`t have to CRUD action with requested reservations."); }

                var conferenceReservationsCnt = reservationsToUpdate.GroupBy(r=>r.Conference).ToDictionary(g=>g.Key, g=> g.Sum(r=>r.NumberOfTickets));
                
                foreach (var entry in conferenceReservationsCnt)
                {
                    var conference = entry.Key;
                    conference.Occupancy -= entry.Value;
                    if (conference.Occupancy < 0)  // TODO: find correct logic for solve this issue
                    {
                        conference.Occupancy = 0;
                    }
                }
          
                ((IReservationRepo)MainRepo).DeleteRange(reservationsToUpdate);
                return Ok("Successfully deleted reservations.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}\n{ex.StackTrace}");
                return Problem("Internal error");
            }
        }

    }
}
