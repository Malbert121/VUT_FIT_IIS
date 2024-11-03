import React, { useEffect, useState } from 'react';
import { getAllPresentations } from '../../api';
import { Presentation } from '../../data';
import { Link } from 'react-router-dom';
import './LecturesPage.css';

import SearchBar from '../../Components/SearchBar/SearchBar'; // Import the SearchBar component

const LecturesPage: React.FC = () => {
  const [presentations, setPresentations] = useState<Presentation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPresentations = async () => {
      try {
        const data = await getAllPresentations();
        setPresentations(data);
      } catch (error) {
        setError('Failed to fetch presentations.');
        console.error("Error fetching presentations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPresentations();
  }, []);

  // Empty function to test UI display - TODO
  const handleSearch = () => {};

  if (loading) {
    return <div className="loading">Loading presentations...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="LecturesPage">
      <h1 className="title">Lectures</h1>
      <p className="description">Welcome to the Lectures page. Here you can find information about upcoming and past lectures.</p>

      {/* Insert the SearchBar component */}
      <div className="search-bar-container">
        <SearchBar onSearch={handleSearch} />
      </div>

      <div className="presentation-list">
        {presentations.map((presentation) => (
          <div key={presentation.Id} className="presentation-card">
            <Link to={`./${presentation.Id}`}>
              <h2 className="presentation-title">{presentation.Title || 'Untitled'}</h2>
            </Link>
            <p className="presentation-description">{presentation.Description || 'No description available.'}</p>
            <p className="presentation-dates">
              <strong>Start Time:</strong> {presentation.StartTime} <br />
              <strong>End Time:</strong> {presentation.EndTime}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LecturesPage;
