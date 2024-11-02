using Conventus.Models.Entities.Base;
using System.Text.Json.Serialization;
namespace Conventus.Models.Entities;

public class Room : BaseEntity
{
    public string Name { get; set; }
    public int Capacity { get; set; }
    [JsonIgnore]
    public virtual List<Presentation> Presentations { get; set; } = new List<Presentation>();
    public int ConferenceId { get; set; }
    [JsonIgnore]
    public virtual Conference? Conference { get; set; }
}
