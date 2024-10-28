import React, { useEffect, useState } from 'react';
import { getAllPresentations } from '../../api'; // Adjust the import based on your structure
import { Presentation } from '../../data'; // Adjust based on your structure
import './LecturesPage.css'; // Create a new CSS file for styles

import SearchBar from '../../Components/SearchBar/SearchBar'; // Import the SearchBar component

const LecturesPage: React.FC = () => {
  const [lectures, setLectures] = useState<Presentation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLectures = async () => {
      try {
        const data = await getAllPresentations();
        setLectures(data);
      } catch (error) {
        setError('Failed to fetch lectures.');
        console.error("Error fetching lectures:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLectures();
  }, []);

  // Empty function to test UI display - TODO
  const handleSearch = () => {};

  if (loading) {
    return <div className="loading">Loading lectures...</div>;
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

      <div className="lecture-list">
        {lectures.map((lecture) => (
          <div key={lecture.Id} className="lecture-card">
            <h2 className="lecture-title">{lecture.Title || 'Untitled'}</h2>
            <p className="lecture-description">{lecture.Description || 'No description available.'}</p>
            <p className="lecture-dates">
              <strong>Start Time:</strong> {lecture.StartTime} <br />
              <strong>End Time:</strong> {lecture.EndTime}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LecturesPage;
