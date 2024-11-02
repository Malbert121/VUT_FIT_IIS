using Conventus.Models.Entities.Base;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Conventus.Models.Entities;

public class Conference : BaseEntity
{
    public string Name { get; set; }
    public string Description { get; set; }
    public string Genre { get; set; }
    public string Location { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public decimal Price { get; set; }
    public int Capacity { get; set; }
    public int Occupancy { get; set; }
    public string PhotoUrl { get; set; }
    [JsonIgnore]
    public virtual List<Presentation> Presentations { get; set; } = new List<Presentation>();
    [JsonIgnore]
    public virtual List<Reservation> Reservations { get; set; } = new List<Reservation>();
    [JsonIgnore]
    public virtual List<Room> Rooms { get; set; } = new List<Room>();
    public int OrganizerId { get; set; }
    [ForeignKey(nameof(OrganizerId))]
    public virtual User? Organizer { get; set; }
}
