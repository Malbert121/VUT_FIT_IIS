import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getPresentation, updatePresentation, getAllConferences, getAllRooms } from '../../api';
import { Presentation, Conference, Room } from '../../data';
import { useUser } from '../../context/UserContext';
import './EditLecturePage.css';

const EditLecturePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const user = useUser();
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [presentation, setPresentation] = useState<Presentation | null>(null);
  const [editedPresentation, setEditedPresentation] = useState<Presentation | null>(null);
  const [conferences, setConferences] = useState<Conference[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPresentation = useCallback(async () => {
    console.log("Fetching presentation with ID:", id);
    try {
      if(!user)
      {
        return;
      }
      setIsAuthorized(true);
      const data = await getPresentation(Number(id));
      if (data?.SpeakerId !== Number(user?.id)) {
        //|| data?.Conference?.OrganizerId !== Number(user?.id)
        setError('You you dont have rights for editing actual presentation.');
        return;
      }
      const conferencesData = await getAllConferences();
      const roomsData = await getAllRooms();
      setPresentation(data);
      setEditedPresentation(data);
      setConferences(conferencesData);
      setRooms(roomsData || []);
    } catch (error) {
      setError('Failed to fetch presentation details.');
      console.error("Error fetching presentation details:", error);
    } finally {
      setLoading(false);
    }
  }, [id, user]);

  useEffect(() => {
    fetchPresentation();
  }, [fetchPresentation]);

  const handleInputChange = (field: keyof Presentation, value: any) => {
    if (!editedPresentation) return;

    // Handle nested object for "Room" specifically
    if (field === 'Room') {
      setEditedPresentation({
        ...editedPresentation,
        Room: {
          ...editedPresentation.Room,
          Name: value.Name,  // Update the Name property within Room
        },
      });
    } else {
      setEditedPresentation({
        ...editedPresentation,
        [field]: value,
      });
    }
  };

  const handleConferenceChange = (conferenceId: number) => {
    const selectedConference = conferences.find(conference => conference.Id === conferenceId);
    if (selectedConference) {
      setEditedPresentation({
        ...editedPresentation!,
        Conference: selectedConference,
      });
    }
  }

  const handleRoomChange = (roomId: number) => {
    const selectedRoom = rooms.find(room => room.Id === roomId);
    if (selectedRoom) {
      setEditedPresentation({
        ...editedPresentation!,
        Room: selectedRoom,
      });
    }
  }

  const handleDateChange = (field: 'StartTime' | 'EndTime', value: string) => {
    if (!editedPresentation) return;
    setEditedPresentation({
      ...editedPresentation,
      [field]: value,
    });
  };

  const cancelLectureEdit = () => {
    console.log("Cancel Edit button clicked.");
    navigate(-1);
  }

  const saveLectureChanges = async (userId:number) => {
    console.log('Save Changes button clicked.');
    if (editedPresentation) {
      try {
        const updatedPresentation = await updatePresentation(userId,{
          ...presentation, // Keep the original object
          ...editedPresentation, // Overwrite only updated fields
        });
        console.log('Presentation updated:', updatedPresentation);
        fetchPresentation();
        //navigate(-1); // Navigate back after saving
      } catch (error) {
        setError('Failed to save changes.');
        console.error('Error saving presentation details:', error);
      }
    }
  };

  
  if(!isAuthorized){
    return <div className="error">User should be authorized for interaction with reservations.</div>;
  }

  if (loading) {
    return <div className="loading">Loading presentation details...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (!presentation || !editedPresentation) {
    return <div className="error">Presentation not found.</div>;
  }

  return (
    <div className="presentation-detail">
      {/* Title Input */}
      <div className="input-container">
        <label>Title:</label>
        <input
          className="input-field"
          type="text"
          value={editedPresentation.Title || ''}
          onChange={(e) => handleInputChange('Title', e.target.value)}
        />
      </div>

      {/* Conference Selection */}
      <div className="input-container">
          <label>Conference:</label>
        <select
          className="input-field"
          value={editedPresentation.Conference?.Id.toString() || ''}
          onChange={(e) => handleConferenceChange(Number(e.target.value))}
        >
          <option value="">Select Conference</option>
          {conferences.map((conference) => (
            <option key={conference.Id} value={conference.Id}>
              {conference.Name}
            </option>
          ))}
        </select>
      </div>

      {/* Description Input */}
      <div className="input-container">
        <label>Description:</label>
        <textarea
          className="input-field presentation-description"
          value={editedPresentation.Description || ''}
          onChange={(e) => handleInputChange('Description', e.target.value)}
        />
      </div>

      {/* Tags Input */}
      <div className="input-container">
        <label>Tags:</label>
        <input
          className="input-field"
          value={editedPresentation.Tags || ''}
          onChange={(e) => handleInputChange('Tags', e.target.value)}
        />
      </div>

      {/* Location (auto-filled based on Conference) */}
      <div className="input-container">
        <label>Location:</label>
        <input
          className="input-field"
          type="text"
          value={editedPresentation.Conference?.Location || "Location is not specified."}
          disabled
        />
      </div>

      {/* Room Selection */}
      <div className="input-container">
        <label>Room:</label>
        <select
          className="input-field"
          value={editedPresentation.Room?.Id.toString() || ''}
          onChange={(e) => handleRoomChange(Number(e.target.value))}
        >
          <option value="">Select Room</option>
          {rooms.map((room) => (
            <option key={room.Id} value={room.Id}>
              {room.Name}
            </option>
          ))}
        </select>
      </div>

      {/* Start Time Input */}
      <div className="input-container">
        <label>Start Time:</label>
        <input
          className="input-field"
          type="datetime-local"
          value={editedPresentation.StartTime || ''}
          onChange={(e) => handleDateChange('StartTime', e.target.value)}
        />
      </div>

      {/* End Time Input */}
      <div className="input-container">
        <label>End Time:</label>
        <input
          className="input-field"
          type="datetime-local"
          value={editedPresentation.EndTime || ''}
          onChange={(e) => handleDateChange('EndTime', e.target.value)}
        />
      </div>

      {/* TODO: add photos and pictures. */}

      {/* Speaker Information (auto-filled) */}
      <div className="input-container">
        <h3>Speaker Information</h3>
        <p><strong>Speaker:</strong> {presentation.Speaker.UserName || "Unknown."}</p>
        <p><strong>Email:</strong> {presentation.Speaker.Email || "Unknown."}</p>
      </div>

      {/* Button Container */}
      <div className="button-container">
        {/* Cancel Edit Button. */}
        <button className="cancel-edit-button" onClick={cancelLectureEdit}>Cancel Edit</button>
        {/* Save Changes Button */}
        <button className="save-changes-button" onClick={()=>{saveLectureChanges(Number(user?.id))}}>Save Changes</button>
      </div>
    </div>
  );
};

export default EditLecturePage;
