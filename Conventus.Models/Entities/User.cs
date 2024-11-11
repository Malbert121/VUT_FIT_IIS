using Conventus.Models.Enums;
using Conventus.Models.Entities.Base;
using System.Text.Json.Serialization;

namespace Conventus.Models.Entities;
public class User : BaseEntity
{
    public string UserName { get; set; }
    public string Email { get; set; }
    public string PasswordHash { get; set; }
    public Role Role { get; set; }
    [JsonIgnore]
    public virtual List<Conference> OrganizedConferences { get; set; } = new List<Conference>();
    [JsonIgnore]
    public virtual List<Presentation> Presentations { get; set; } = new List<Presentation>();
    [JsonIgnore]
    public virtual List<Reservation> Reservations { get; set; } = new List<Reservation>();
}
