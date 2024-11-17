import React, { useEffect, useState } from 'react';
import { useParams , Link} from 'react-router-dom';
import { Reservation } from '../../data';
import { getReservation } from '../../api';
import ReservationDetailCard from '../../Components/ReservationDetailCard/ReservationDetailCard';
import { useUser } from '../../context/UserContext'
interface Props{}

const ReservationDetailPage: React.FC<Props> = () => {
    const user = useUser();
    const { reservationId } = useParams<{ reservationId: string }>();
    const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
    const [reservation, setReservation] = useState<Reservation | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    
 
    useEffect(()=>{
        const fetchReservation = async ()=>
        {
            if(!user)
            {
                return;
            }
            console.log("Fetching reservation with ID:", reservationId);
            setIsAuthorized(true);
            try
            {
                const data = await getReservation(Number(reservationId), Number(user.id));
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
    }, [reservationId, user])
    
    if(!isAuthorized){
        return <div className="error">User should be authorized for interaction with reservations.</div>;
    }
    
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