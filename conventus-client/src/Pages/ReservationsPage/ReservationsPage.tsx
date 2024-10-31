import React from 'react';
import SideBar from '../../Components/SideBar/SideBar';

// Sample reservation data type
interface Reservation {
  id: number;
  name: string;
  price: number;
  available: boolean;
}

// Sample data (replace this with actual data fetching logic)
const sampleReservations: Reservation[] = [
  { id: 1, name: 'VIP Reservation', price: 100, available: true },
  { id: 2, name: 'Regular Reservation', price: 50, available: true },
  { id: 3, name: 'Student Reservation', price: 30, available: false },
];

const ReservationsPage: React.FC = () => {
  const handlePurchase = (reservation: Reservation) => {
    if (reservation.available) {
      // Implement your purchase logic here (e.g., API call)
      console.log(`Purchased reservation: ${reservation.name}`);
    } else {
      alert('This reservation is not available.');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Available Reservations</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sampleReservations.map((reservation) => (
          <div
            key={reservation.id}
            className={`p-4 border rounded shadow-md ${
              reservation.available ? 'bg-white' : 'bg-gray-200'
            }`}
          >
            <h2 className="text-xl font-semibold">{reservation.name}</h2>
            <p className="text-lg mb-2">${reservation.price}</p>
            <button
              onClick={() => handlePurchase(reservation)}
              className={`px-4 py-2 rounded text-white ${
                reservation.available ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-400'
              }`}
              disabled={!reservation.available}
            >
              {reservation.available ? 'Purchase' : 'Sold Out'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReservationsPage;
