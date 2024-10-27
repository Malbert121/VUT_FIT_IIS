import React from 'react';
import SideBar from '../../Components/SideBar/SideBar';

// Sample ticket data type
interface Ticket {
  id: number;
  name: string;
  price: number;
  available: boolean;
}

// Sample data (replace this with actual data fetching logic)
const sampleTickets: Ticket[] = [
  { id: 1, name: 'VIP Ticket', price: 100, available: true },
  { id: 2, name: 'Regular Ticket', price: 50, available: true },
  { id: 3, name: 'Student Ticket', price: 30, available: false },
];

const Tickets: React.FC = () => {
  const handlePurchase = (ticket: Ticket) => {
    if (ticket.available) {
      // Implement your purchase logic here (e.g., API call)
      console.log(`Purchased ticket: ${ticket.name}`);
    } else {
      alert('This ticket is not available.');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Available Tickets</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sampleTickets.map((ticket) => (
          <div
            key={ticket.id}
            className={`p-4 border rounded shadow-md ${
              ticket.available ? 'bg-white' : 'bg-gray-200'
            }`}
          >
            <h2 className="text-xl font-semibold">{ticket.name}</h2>
            <p className="text-lg mb-2">${ticket.price}</p>
            <button
              onClick={() => handlePurchase(ticket)}
              className={`px-4 py-2 rounded text-white ${
                ticket.available ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-400'
              }`}
              disabled={!ticket.available}
            >
              {ticket.available ? 'Purchase' : 'Sold Out'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tickets;
