import React, { useEffect, useState, useCallback } from 'react';
import { getMyPresentations } from '../../api';
import { Presentation } from '../../data';
import { Link } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import Toast from '../../Components/Toast/Toast';
import SwitchButton from '../../Components/SwitchButton/SwitchButton';
import './MyLecturesPage.css';

const MyLecturesPage: React.FC = () => {
  
  const user = useUser();
  const [presentations, setPresentations] = useState<Presentation[]>([]);
  const [filteredPresentations, setFilteredPresentations] = useState<Presentation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('info');
  const closeToast = () => setToastMessage(null);
  

  // Filtering states
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const [conferenceNameFilter, setConferenceNameFilter] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [confirmStatusFilter, setConfirmStatusFilter] = useState<string|null>(null);
  const [timeRange, setTimeRange] = useState<{ from: string; to: string }>({ from: '', to: '' });
  const confirmStatus = ['Confirm', 'Unconfirm'];
  // Extract unique tags from presentations
  // swicth
  const [isOn, setIsOn] = useState(false);  // isOne = I am owner
  const handleSwitch = () => {
    setIsOn((prev) => !prev);
  };
  
  const uniqueTags = Array.from(
    new Set(
      presentations
        .flatMap((presentation) =>
          presentation.Tags ? presentation.Tags.split(',').map((tag) => tag.trim()) : []
        )
    )
  );
  
  const fetchPresentations = useCallback(async () => {
    try {
      if(!user){
        return;
      }
      console.log(Number(user.id));
      setIsAuthorized(true);
      const data = await getMyPresentations(Number(user.id));
      console.log("Presentations data:", data);
      setPresentations(data);
      setFilteredPresentations(data);
    } catch (error) {
      setError('Failed to fetch presentation.');
      console.error("Error fetching presentation:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
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
    if (confirmStatusFilter) {
      if(confirmStatusFilter === 'Confirm'){
        filtered = filtered.filter(presentation =>presentation.IsConfirmed);
      }
      else{
        filtered = filtered.filter(presentation =>!presentation.IsConfirmed);
      }
    }
    if(conferenceNameFilter){
      filtered = filtered.filter(presentation =>
        presentation.Conference?.Name.toLowerCase().includes(conferenceNameFilter.toLowerCase())
      )
    }
    if(isOn){
      if(user?.role !== 'Admin'){
        filtered = filtered.filter(presentations=>presentations.Conference?.OrganizerId == Number(user?.id));
      }
    }
    else{
      filtered = filtered.filter(presentations=>presentations.SpeakerId == Number(user?.id));
    }

    // Time range filter
    if (timeRange.from) filtered = filtered.filter(presentation => new Date(presentation.StartTime) >= new Date(timeRange.from));
    if (timeRange.to) filtered = filtered.filter(presentation => new Date(presentation.EndTime) <= new Date(timeRange.to));

    setFilteredPresentations(filtered);
  }, [tagFilter, searchTerm, timeRange, presentations, conferenceNameFilter, confirmStatusFilter, isOn]);

  
  if(!isAuthorized){
    return <div className="error">User should be authorized for interaction with presentation.</div>;
  }
  
  if (loading) {
    return <div className="loading">Loading presentations...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="MyLecturesPage">
      <SwitchButton OnText='Conference owner' OffText='Conference speaker' isOn={isOn} onSwitch={handleSwitch}/>
      {toastMessage && (
      <Toast message={toastMessage} onClose={closeToast} type={toastType} />
      )}
      <h1 className="title">My Lectures</h1>
      <p className="description">Here you can find information about your lectures.</p>

      <div className="filters">
        <input
          type="text"
          placeholder="Search by title or description"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <input
          type="text"
          placeholder="Search by conference"
          value={conferenceNameFilter}
          onChange={(e) => setConferenceNameFilter(e.target.value)}
        />
        <select onChange={(e) => setConfirmStatusFilter(e.target.value || null)}>
          <option value="">All confirm status</option>
          {confirmStatus.map((confirmStatus) => (
            <option key={confirmStatus}>{confirmStatus}</option>
          ))}
        </select>
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
            <Link to={`../lectures/${presentation.Id}`}>
              <h2 className="text-2xl font-bold text-blue-600 mb-2.5">{presentation.Title || 'Untitled'}</h2>
            </Link>
            <p>
              <strong className="text-xl" style={{color:presentation.IsConfirmed?'green':'red'}}>{presentation.IsConfirmed?'Confirm':'Unconfirm'}</strong>
            </p>
            <p className="presentation-tags">
              <strong>Conference:</strong> {presentation.Conference?.Name || 'No conference available.'}
            </p>
            
            <p className="presentation-tags">
              <strong>Tags:</strong> {presentation.Tags}
            </p>
            <p className="presentation-dates">
              <strong>Start Time:</strong> {presentation.StartTime} <br />
              <strong>End Time:</strong> {presentation.EndTime}
            </p>
            <p className="presentation-description">{presentation.Description || 'No description available.'}</p>
            
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyLecturesPage;
