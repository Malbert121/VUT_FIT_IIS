using Conventus.Models.Entities.Base;

namespace Conventus.Models.Entities;
public class Presentation : BaseEntity
{
    public string Title { get; set; }
    public string Description { get; set; }
    public string Tags { get; set; }
    public string PhotoUrl { get; set; }  // For poster/logo/photo
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public int RoomId { get; set; }
    public Room Room { get; set; }
    public int SpeakerId { get; set; }
    public User Speaker { get; set; }
    public int ConferenceId { get; set; }
    public Conference Conference { get; set; }
}
