import React, { useEffect, useState, useCallback } from 'react';
import { useParams} from 'react-router-dom';
import { Reservation } from '../../data';
import { getReservation } from '../../api';
import ReservationDetailCard from '../../Components/ReservationDetailCard/ReservationDetailCard';
import { putResirvationsToConfirm, putResirvationsToPay, deleteReservations } from '../../api';
import { useUser } from '../../context/UserContext'
import Toast from '../../Components/Toast/Toast';

interface Props{}

const ReservationDetailPage: React.FC<Props> = () => {
    const user = useUser();
    const { reservationId } = useParams<{ reservationId: string }>();
    const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
    const [reservation, setReservation] = useState<Reservation | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('info');
    const closeToast = () => setToastMessage(null);

    const fetchReservation = useCallback(async ()=>{
        if(!user){
            return;
        }
        console.log("Fetching reservation with ID:", reservationId);
        setIsAuthorized(true);
        try{
            const data = await getReservation(Number(reservationId), Number(user.id));
            setReservation(data);
        }
        catch(error){
            setError('Failed to fetch reservation details.');
            console.error("Error fetching reservation details:", error);
        }
        finally{
            setLoading(false);
        }
    }, [user, reservationId]);

    useEffect(()=>{
        fetchReservation();
    }, [fetchReservation])
    
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

    const handleReservationsToPayment = async ()=>{
        try{
            await putResirvationsToPay([reservation.Id], Number(user?.id));
            setToastType("success");
            setToastMessage("User have successfully paid reservation.");
            fetchReservation();
        }
        catch(error){
            console.error(error);
            setToastType('error');
            setToastMessage((error as Error).message);
        }
    };

    const handleReservationsToConfirm = async (flag:boolean)=>{
        try{
            if(user)
            {
            await putResirvationsToConfirm([reservation.Id], Number(user.id), flag);
            setToastType("success");
            setToastMessage("User have successfully confirmed reservation.");
            fetchReservation();
            }
            else{
                console.log('Unauthorized user is bad boy!'); //TODO: solve unauthorized user behavioral  
                setToastType('error');
                setToastMessage('Unauthorized user is bad boy!');
            }
        }
        catch(error){
            console.error(error);
            setToastType('error');
            setToastMessage((error as Error).message);
        }
    };
    
    const handleReservationsToDelete = async ()=>{
    try{
        if(user){
            await deleteReservations([reservation.Id], Number(user.id));
            setToastType("success");
            setToastMessage("User have successfully deleted reservation.");
            fetchReservation();
        }
        else{
            console.log('Unauthorized user is bad boy!'); //TODO: solve unauthorized user behavioral  
            setToastType('error');
            setToastMessage('Unauthorized user is bad boy!');
        }
    }
    catch(error){
        console.error(error);
        setToastType('error');
        setToastMessage((error as Error).message);
    }
};
    return (
        <>
            {toastMessage && (
                <Toast message={toastMessage} onClose={closeToast} type={toastType} />
            )}
            <ReservationDetailCard 
                reservation={reservation}
                toPaid={()=>{handleReservationsToPayment()}}
                toConfirm={(flag:boolean)=>{handleReservationsToConfirm(flag)}}
                toDelete={()=>{handleReservationsToDelete()}}
            />
        </>
    );
}
export default ReservationDetailPage