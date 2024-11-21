import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { getPresentation, deletePresentation, putPresentationsToConfirm } from '../../api'; // Adjust the import based on your structure
import { Presentation } from '../../data'; // Adjust based on your structure
import { pathEditLecture } from '../../Routes/Routes';
import SwitchButton from '../../Components/SwitchButton/SwitchButton';
import Toast from '../../Components/Toast/Toast';
import './LectureDetailPage.css'; // Ensure you have this CSS file

const LectureDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get the ID from the URL
  const user = useUser();
  const navigate = useNavigate();
  const [presentation, setPresentation] = useState<Presentation | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('info');
  const closeToast = () => setToastMessage(null);
  // swicth
  const [isOn, setIsOn] = useState(false);  // isOne = confirm
  const handleSwitch = () => {
    setIsOn((prev) => !prev);
  };
  const fetchPresentation = useCallback(async () => {
    console.log("Fetching presentation with ID:", id);
    try {
      const data = await getPresentation(Number(id));
      console.log("Fetched presentation data:", data);
      setPresentation(data);
    } catch (error) {
      setError('Failed to fetch presentation details.');
      console.error("Error fetching presentation details:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPresentation();
  }, [fetchPresentation]);

  useEffect(()=>{
    if(presentation && user){
      if(isOn){
        confirmLecture(presentation.Id, Number(user.id), true);
      }
      else{
        confirmLecture(presentation.Id, Number(user.id), false);
      }
    }
  }, [isOn])

  const editLectureDetails = (presentationId: number) => {
    console.log("Edit Details button clicked.");
    navigate(`${pathEditLecture}/${presentationId}`);
  };

  const deleteLecture = async () => {
    console.log("Delete button clicked.");
    const confirmed = window.confirm("Are you sure you want to delete this lecture?");
    if (confirmed) {
      try {
        await deletePresentation(Number(id));
        setToastType("success");
        setToastMessage("User have successfully deleted presentation.");
        fetchPresentation();
      } catch (error) {
        setToastType("error");
        setToastMessage((error as Error).message);
      }
    } else {
      console.log("Deletion cancelled.");
    }
  }

  const confirmLecture = async (presentation_id:number, user_id:number, flag:boolean) => {
    try{
        await putPresentationsToConfirm([presentation_id], user_id, flag);
        setToastType("success");
        setToastMessage("User have successfully change confirm status of presentation.");
        fetchPresentation();
    }
    catch(error){
      setToastType("error");
      setToastMessage((error as Error).message);
    }
  }

  if (loading) {
    return <div className="loading">Loading presentation details...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (!presentation) {
    return <div className="error">Presentation not found.</div>;
  }
  return (
    <div className="presentation-detail">
      {toastMessage && (
        <Toast message={toastMessage} onClose={closeToast} type={toastType} />
      )}
      {(user != null) && (Number(user.id) === presentation.Conference?.OrganizerId || user.role === 'Admin') && (
        <SwitchButton OnText='Confirm' OffText='UnConfirm' isOn={isOn} onSwitch={handleSwitch}/>
      )}
      <h1 className="presentation-title">{presentation.Title}</h1>
        <Link to={`/conferences/${presentation.ConferenceId}`}>
          <h2 className="text-center text-2xl underline underline-offset-2 text-blue-500 mb-10">{presentation.Conference?.Name}</h2>
        </Link>
      <div className="info-container">
      {
        (user != null) && (Number(user.id) === presentation.Conference?.OrganizerId || user.role === 'Admin')
        && (
          <>
          <p><strong>Status: </strong><strong style={{color:presentation.IsConfirmed?'green':'red'}}>{presentation.IsConfirmed?'Confirm':'Unconfirm'}</strong></p>
          </>
        )
      }
        <p className="presentation-tags"><strong>Tags:</strong> {presentation.Tags || "Tags are not specified."}</p>
        <p className="presentation-location"><strong>Location:</strong> {presentation.Conference?.Location || "Location is not specified."}</p>
        <p className="presentation-room"><strong>Room:</strong> {presentation.Room?.Name || "Room is not specified."}</p>
        <p className="presentation-dates">
          <strong>Start Time:</strong> {presentation.StartTime} <br />
          <strong>End Time:</strong> {presentation.EndTime}
        </p>
      </div>
      <div className="speaker-info">
        <h3>Speaker Information</h3>
        <p><strong>Speaker:</strong> {presentation.Speaker?.UserName || "Speaker is not specified."}</p>
        <p><strong>Email:</strong> {presentation.Speaker?.Email || "Email is not specified."}</p>
      </div>
      <div className="description-container">
        <p className="presentation-description">{presentation.Description}</p>
      </div>
      {/* TODO: add photos and pictures. */}
      { (user != null 
        &&(Number(user.id) === presentation.SpeakerId || Number(user.id) === presentation.Conference?.OrganizerId || user.role === "Admin"))
        &&(
        <div className="button-container">
          <button className="edit-details-button" onClick={()=>{editLectureDetails(presentation.Id)}}>Edit Details</button>
          <button className="delete-button" onClick={deleteLecture}>Delete Lecture</button>
        </div>)
      }
    </div>
  );
};

export default LectureDetailPage;
