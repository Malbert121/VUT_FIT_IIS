using Conference.Models.Entities.Base;
namespace Conference.Models.Entities;

public class Room : BaseEntity
{
    public string Name { get; set; }
    public int Capacity { get; set; }
    public List<Presentation> Presentations { get; set; } = new List<Presentation>();
}
