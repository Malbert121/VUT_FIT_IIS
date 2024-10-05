using Conventus.Models.Enums;
using Conventus.Models.Entities.Base;

namespace Conventus.Models.Entities;
public class User : BaseEntity
{
    public string UserName { get; set; }
    public string Email { get; set; }
    public string PasswordHash { get; set; }
    public Role Role { get; set; }
    public List<Conference> OrganizedConferences { get; set; } = new List<Conference>();
    public List<Presentation> Presentations { get; set; } = new List<Presentation>();
    public List<Reservation> Reservations { get; set; } = new List<Reservation>();
}
