import React, { useEffect, useState } from 'react';
import { getAllConferences } from '../../api'; // Adjust the import based on your structure
import { Conference } from '../../data'; // Adjust based on your structure
import './ConferencesPage.css';

function ConferencesPage() {
  const [conferences, setConferences] = useState<Conference[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConferences = async () => {
      try {
        const data = await getAllConferences();
        console.log("Conferences data:", data);
        setConferences(data);
      } catch (error) {
        setError('Failed to fetch conferences.');
        console.error("Error fetching conferences:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConferences();
  }, []);

  if (loading) {
    return <div className="loading">Loading conferences...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="ConferencesPage">
      <h1 className="title">Upcoming Conferences</h1>
      <p className="description">Here are the upcoming conferences:</p>
      <div className="conference-list">
        {conferences.map((conference) => (
          <div key={conference.Id} className="conference-card">
            <h2 className="conference-name">{conference.Name || 'Unnamed Conference'}</h2>
            <p className="conference-description">{conference.Description || 'No description available.'}</p>
            <p className="conference-location"><strong>Location:</strong> {conference.Location || 'Not specified'}</p>
            <p className="conference-dates">
              <strong>Start Date:</strong> {conference.StartDate} <br />
              <strong>End Date:</strong> {conference.EndDate}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ConferencesPage;
