import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getConference } from '../../api';
import { Conference } from '../../data';
import './ConferenceDetailPage.css';

const ConferenceDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [conference, setConference] = useState<Conference | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConference = async () => {
      console.log("Fetching conference with ID:", id);
      try {
        const data = await getConference(Number(id));
        console.log("Fetched conference data:", data);
        setConference(data);
      } catch (error) {
        setError('Failed to fetch conference details.');
        console.error("Error fetching conference details:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchConference();
  }, [id]);
  
  if (loading) {
    return <div className="loading">Loading conference details...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (!conference) {
    return <div className="error">Conference not found.</div>;
  }

  return (
    <div className="conference-detail">
      <h1 className="conference-title">{conference.Name}</h1>
      <div className="description-container">
        <p className="conference-description">{conference.Description}</p>
      </div>
      <div className="info-container">
        <p><strong>Location:</strong> {conference.Location}</p>
        <p><strong>Start Date:</strong> {conference.StartDate}</p>
        <p><strong>End Date:</strong> {conference.EndDate}</p>
        <p><strong>Price:</strong> ${conference.Price.toFixed(2)}</p>
        <button className="add-to-cart-button">Add to Cart</button>
      </div>
      <div className="organizer-info">
        <h3>Organizer Information</h3>
        <p><strong>Organizer:</strong> {conference.Organizer.UserName} (Email: {conference.Organizer.Email})</p>
        <p><strong>Capacity:</strong> {conference.Capacity}</p>
      </div>
      
      <h2 className="presentations-title">Presentations</h2>
      {conference.Presentations && conference.Presentations.length > 0 ? (
        <ul className="presentation-list">
          {conference.Presentations.map((presentation) => (
            <li key={presentation.Id} className="presentation-item">
              <h3>{presentation.Title}</h3>
              <p><strong>Description:</strong> {presentation.Description}</p>
              <p><strong>Tags:</strong> {presentation.Tags}</p>
              <p><strong>Speaker:</strong> {presentation.Speaker.UserName} (Email: {presentation.Speaker.Email})</p>
              <p><strong>Room:</strong> {presentation.Room.Name}</p>
              <p><strong>Start Time:</strong> {presentation.StartTime}</p>
              <p><strong>End Time:</strong> {presentation.EndTime}</p>
              {presentation.PhotoUrl && ( 
                <img src={presentation.PhotoUrl} alt="photo" className="presentation-image" />
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No presentations available for this conference.</p>
      )}
    </div>
  );
};

export default ConferenceDetailPage;
