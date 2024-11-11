import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPresentation } from '../../api'; // Adjust the import based on your structure
import { Presentation } from '../../data'; // Adjust based on your structure
import './LectureDetailPage.css'; // Ensure you have this CSS file

const LectureDetailPage = () => {
  const { id } = useParams<{ id: string }>(); // Get the ID from the URL
  const [presentation, setPresentation] = useState<Presentation | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPresentation = async () => {
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
    };
  
    fetchPresentation();
  }, [id]);
  
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
      <div className="description-container">
        <p className="presentation-description">{presentation.Description}</p>
      </div>
      <div className="info-container">
        <p><strong>Tags:</strong> {presentation.Tags}</p>
        {/* TODO: add photos and pictures. */}
        <p><strong>Start Time:</strong> {presentation.StartTime}</p>
        <p><strong>End Time:</strong> {presentation.EndTime}</p>
        <p><strong>Room:</strong> {presentation.Room.Name}</p>
      </div>
      <div className="speaker-info">
        <h3>Speaker Information</h3>
        <p><strong>Speaker:</strong> {presentation.Speaker.UserName}</p>
      </div>
    </div>
  );
};

export default LectureDetailPage;
