namespace DAL.Models;
public class Room : BaseEntity
{
    public string Name { get; set; }
    public int Capacity { get; set; }
    public List<Presentation> Presentations { get; set; } = new List<Presentation>();
}
