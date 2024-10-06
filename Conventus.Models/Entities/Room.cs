using Conventus.Models.Entities.Base;
using System.Text.Json.Serialization;
namespace Conventus.Models.Entities;

public class Room : BaseEntity
{
    public string Name { get; set; }
    public int Capacity { get; set; }
    [JsonIgnore]
    public List<Presentation> Presentations { get; set; } = new List<Presentation>();
}
