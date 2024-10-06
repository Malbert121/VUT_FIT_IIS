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
    public List<Conference> OrganizedConferences { get; set; } = new List<Conference>();
    [JsonIgnore]
    public List<Presentation> Presentations { get; set; } = new List<Presentation>();
    [JsonIgnore]
    public List<Reservation> Reservations { get; set; } = new List<Reservation>();
}
