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
    public List<Presentation> Presentations { get; set; } = new List<Presentation>();
    public List<Reservation> Reservations { get; set; } = new List<Reservation>();
    public int OrganizerId { get; set; }
    [ForeignKey(nameof(OrganizerId))]
    public User? Organizer { get; set; }
}
