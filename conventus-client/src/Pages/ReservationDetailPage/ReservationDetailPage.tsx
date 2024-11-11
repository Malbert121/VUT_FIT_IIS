import React, { useEffect, useState } from 'react';
import { useParams , Link} from 'react-router-dom';
import { Reservation } from '../../data';
import { getReservation } from '../../api';
import { pathConferences } from '../../Routes/Routes';
import ReservationDetailCard from '../../Components/ReservationDetailCard/ReservationDetailCard';
interface Props{}

const ReservationDetailPage: React.FC<Props> = () => {
    const { reservationId } = useParams<{ reservationId: string }>();
    const [reservation, setReservation] = useState<Reservation | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    useEffect(()=>{
        const fetchReservation = async ()=>
        {
            console.log("Fetching conference with ID:", reservationId);
            try
            {
                const data = await getReservation(Number(reservationId));
                setReservation(data);
            }
            catch(error)
            {
                setError('Failed to fetch reservation details.');
                console.error("Error fetching reservation details:", error);
            }
            finally
            {
                setLoading(false);
            }
        };
        fetchReservation();
    }, [reservationId])
    
    if (loading) {
        return <div className="loading">Loading reservation details...</div>;
    }
    if (error) {
        return <div className="error">Error: {error}</div>;
    }
    if (!reservation) {
        return <div className="error">Reservation not found.</div>;
    }
    
    return (
        <ReservationDetailCard reservation={reservation}/>
    );
}
export default ReservationDetailPage