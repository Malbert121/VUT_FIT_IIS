import React, { useEffect, useState } from 'react';
import { getAllPresentations } from '../../api';
import { Presentation } from '../../data';
import { Link } from 'react-router-dom';
import './MyLecturesPage.css';

const MyLecturesPage: React.FC = () => {
  const [presentations, setPresentations] = useState<Presentation[]>([]);
  const [filteredPresentations, setFilteredPresentations] = useState<Presentation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filtering states
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [timeRange, setTimeRange] = useState<{ from: string; to: string }>({ from: '', to: '' });

  // Extract unique tags from presentations
  const uniqueTags = Array.from(
    new Set(
      presentations
        .flatMap((presentation) =>
          presentation.Tags ? presentation.Tags.split(',').map((tag) => tag.trim()) : []
        )
    )
  );

  useEffect(() => {
    const fetchPresentations = async () => {
      try {
        const data = await getAllPresentations();
        console.log("Presentations data:", data);
        setPresentations(data);
        setFilteredPresentations(data);
      } catch (error) {
        setError('Failed to fetch presentations.');
        console.error("Error fetching presentations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPresentations();
  }, []);

  // Handle filtering
  useEffect(() => {
    let filtered = [...presentations];

    // Tag filter
    if (tagFilter) {
      filtered = filtered.filter((presentation) =>
        presentation.Tags
          ?.split(',')
          .map((tag) => tag.trim())
          .includes(tagFilter)
      );
    }

    // Title or description search
    if (searchTerm) {
      filtered = filtered.filter(presentation =>
        presentation.Title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        presentation.Description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Time range filter
    if (timeRange.from) filtered = filtered.filter(presentation => new Date(presentation.StartTime) >= new Date(timeRange.from));
    if (timeRange.to) filtered = filtered.filter(presentation => new Date(presentation.EndTime) <= new Date(timeRange.to));

    setFilteredPresentations(filtered);
  }, [tagFilter, searchTerm, timeRange, presentations]);

  if (loading) {
    return <div className="loading">Loading presentations...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="MyLecturesPage">
      <h1 className="title">My Lectures</h1>
      <p className="description">Here you can find information about your lectures.</p>

      {/* Add the "Create New Lecture" button */}
      <div className="create-lecture-button-container">
        <Link to="/mylectures/create">
          <button className="create-lecture-button">Create New Lecture</button>
        </Link>
      </div>

      <div className="filters">
        <input
          type="text"
          placeholder="Search by title or description"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select onChange={(e) => setTagFilter(e.target.value || null)}>
          <option value="">All Tags</option>
          {uniqueTags.map((tag) => (
            <option key={tag}>{tag}</option>
          ))}
        </select>
        <div className="flex space-x-4">
          <input
            type="date"
            value={timeRange.from}
            onChange={(e) => setTimeRange({ ...timeRange, from: e.target.value })}
            placeholder="From date"
          />
          <input
            type="date"
            value={timeRange.to}
            onChange={(e) => setTimeRange({ ...timeRange, to: e.target.value })}
            placeholder="To date"
          />
        </div>
      </div>
      <div className="presentation-list">
        {filteredPresentations.map((presentation) => (
          <div key={presentation.Id} className="presentation-card">
            <Link to={`/lectures/${presentation.Id}`}>
              <h2 className="presentation-title">{presentation.Title || 'Untitled'}</h2>
            </Link>
            <p className="presentation-conference">{presentation.Conference?.Name || 'No conference available.'}</p>
            <p className="presentation-description">{presentation.Description || 'No description available.'}</p>
            <p className="presentation-tags">
              <strong>Tags:</strong> {presentation.Tags}
            </p>
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

export default MyLecturesPage;
