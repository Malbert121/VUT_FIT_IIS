using Conventus.Models.Entities.Base;
using System.Text.Json.Serialization;

namespace Conventus.Models.Entities;
public class Reservation : BaseEntity
{
    public int UserId { get; set; }
    public User? User { get; set; }
    public int ConferenceId { get; set; }
    [JsonIgnore]
    public Conference? Conference { get; set; }
    public bool IsConfirmed { get; set; }
    public bool IsPaid { get; set; }
    public int NumberOfTickets { get; set; }
    public DateTime ReservationDate { get; set; }
}
