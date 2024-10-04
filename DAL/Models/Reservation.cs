namespace DAL.Models;
public class Reservation : BaseEntity
{
    public User User { get; set; }
    public Conference Conference { get; set; }
    public bool IsConfirmed { get; set; }
    public bool IsPaid { get; set; }
    public int NumberOfTickets { get; set; }
    public DateTime ReservationDate { get; set; }
}
