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
            return Ok(((IReservationRepo)MainRepo).GetByPaid(true));
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
            return Ok(((IReservationRepo)MainRepo).GetByPaid(false));
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
            return Ok(((IReservationRepo)MainRepo).GetByPaid(true));
        }

        /// <summary>
        /// Update status of reservation to paid
        /// </summary>
        /// <returns>Info string</returns>
        /// <response code="200">Returns info string
        [Produces("application/json")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [SwaggerResponse(200, "Successfully updated the reservations")]
        [SwaggerResponse(400, "The request body was invalid or empty")]
        [SwaggerResponse(404, "No reservations found to update")]
        [SwaggerResponse(500, "Internal server error")]
        [HttpPut("to_pay")]
        public ActionResult<string> PutReservationsToPaid([FromBody]List<int> reservationsIds)
        {
            if(reservationsIds == null || !reservationsIds.Any())
            {
                return BadRequest("Reservations should not be empty");
            }
            bool ret = ((IReservationRepo)MainRepo).UpdatePay(reservationsIds, true);
            if (ret)
            {
                return Ok("Ok");
            }
            else
            {
                return NotFound("Not found reservations");
            }
        }

        /// <summary>
        /// Update status of reservation with confirm
        /// </summary>
        /// <returns>All guest reservations</returns>
        /// <response code="200">Returns info string
        [Produces("application/json")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [SwaggerResponse(200, "Successfully updated the reservations")]
        [SwaggerResponse(400, "The request body was invalid or empty")]
        [SwaggerResponse(404, "No reservations found to update")]
        [SwaggerResponse(500, "Internal server error")]
        [HttpPut("to_confirm")]
        public ActionResult<string> PutReservationsToPaid([FromBody] List<int> reservationsIds, [FromQuery] bool flag)
        {
            if (reservationsIds == null || !reservationsIds.Any())
            {
                return BadRequest("Reservations should not be empty");
            }
            bool ret = ((IReservationRepo)MainRepo).UpdateConfirm(reservationsIds, flag);
            if (ret)
            {
                return Ok("Ok");
            }
            else
            {
                return NotFound("Not found reservations");
            }
        }


    }
}
