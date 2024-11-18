import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { getPresentation, deletePresentation } from '../../api'; // Adjust the import based on your structure
import { Presentation } from '../../data'; // Adjust based on your structure
import { pathEditLecture } from '../../Routes/Routes';
import './LectureDetailPage.css'; // Ensure you have this CSS file

const LectureDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get the ID from the URL
  const user = useUser();
  const navigate = useNavigate();
  const [presentation, setPresentation] = useState<Presentation | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
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
        console.log("Lecture deleted.");
        fetchPresentation();
      } catch (error) {
        setError('Failed to delete the lecture.');
        console.error("Error deleting lecture:", error);
      }
    } else {
      console.log("Deletion cancelled.");
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
      <h1 className="presentation-title">{presentation.Title}</h1>
      <Link to={`/conferences/${presentation.ConferenceId}`}>
        <h2 className="presentation-conference">{presentation.Conference?.Name}</h2>
      </Link>
      <div className="description-container">
        <p className="presentation-description">{presentation.Description}</p>
      </div>
      <div className="info-container">
        <p className="presentation-tags"><strong>Tags:</strong> {presentation.Tags || "Tags are not specified."}</p>
        <p className="presentation-location"><strong>Location:</strong> {presentation.Conference?.Location || "Location is not specified."}</p>
        <p className="presentation-room"><strong>Room:</strong> {presentation.Room.Name || "Room is not specified."}</p>
        <p className="presentation-dates">
          <strong>Start Time:</strong> {presentation.StartTime} <br />
          <strong>End Time:</strong> {presentation.EndTime}
        </p>
      </div>
      {/* TODO: add photos and pictures. */}
      <div className="speaker-info">
        <h3>Speaker Information</h3>
        <p><strong>Speaker:</strong> {presentation.Speaker.UserName || "Speaker is not specified."}</p>
        <p><strong>Email:</strong> {presentation.Speaker.Email || "Email is not specified."}</p>
      </div>
      { (user != null 
        &&(Number(user.id) == presentation.SpeakerId || Number(user.id) == presentation.Conference?.OrganizerId || user.role === "Admin"))
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
