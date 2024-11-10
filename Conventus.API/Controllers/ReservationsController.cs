using Conventus.API.Controllers.Base;
using Conventus.DAL.Repositories.Interfaces;
using Conventus.Models.Entities;
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
        /// Gets all available reservations
        /// </summary>
        /// <returns>All available reservations</returns>
        /// <response code="200">Returns all items</response>
        [Produces("application/json")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [SwaggerResponse(200, "The execution was successfull")]
        [SwaggerResponse(400, "The request was invalid")]
        [HttpGet("available")]
        public ActionResult<IEnumerable<Reservation>> GetAvailableReservations()
        {
            return Ok(((IReservationRepo)MainRepo).GetReservationsByPaid(true));
        }

        /// <summary>
        /// Gets all unpaid reservations
        /// </summary>
        /// <returns>All unpaid reservations</returns>
        /// <response code="200">Returns all items
        [Produces("application/json")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [SwaggerResponse(200, "The execution was successfull")]
        [SwaggerResponse(400, "The request was invalid")]
        [HttpGet("unpaid")]
        public ActionResult<IEnumerable<Reservation>> GetUnpaidReservations()
        {
            return Ok(((IReservationRepo)MainRepo).GetReservationsByPaid(false));
        }

        /// <summary>
        /// Gets all guest reservations
        /// </summary>
        /// <returns>All guest reservations</returns>
        /// <response code="200">Returns all items
        [Produces("application/json")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [SwaggerResponse(200, "The execution was successfull")]
        [SwaggerResponse(400, "The request was invalid")]
        [HttpGet("guest")]
        public ActionResult<IEnumerable<Reservation>> GetGuestReservations()
        {
            return Ok(((IReservationRepo)MainRepo).GetGuestReservations());
        }
    }
}
