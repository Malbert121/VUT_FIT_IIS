import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPresentation, getAllConferences, getAllRooms } from '../../api';
import { Presentation, Conference, Room } from '../../data';
import './NewLecturePage.css';

type PartialPresentation = Partial<Presentation>; // TODO: WTF???

const NewLecturePage: React.FC = () => {
  const navigate = useNavigate();
  const [editedPresentation, setEditedPresentation] = useState<PartialPresentation>({
    Title: '',
    Description: '',
    Tags: '',
    StartTime: '',
    EndTime: '',
    Conference: undefined,
    Room: undefined,
    Speaker: undefined,
  });
  const [conferences, setConferences] = useState<Conference[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [conferencesData, roomsData] = await Promise.all([
          getAllConferences(),
          getAllRooms(),
        ]);
        setConferences(conferencesData);
        setRooms(roomsData || []);
      } catch (error) {
        setError('Failed to fetch data for the new lecture.');
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (field: keyof Presentation, value: any) => {
    if (!editedPresentation) return;

    // Handle nested object for "Room" specifically
    if (field === 'Room') {
      setEditedPresentation({
        ...editedPresentation,
        Room: {
          ...editedPresentation.Room,
          Name: value.Name,  // Update the Name property within Room
          Id: editedPresentation.Room?.Id ?? 0,  // Ensure Id is a valid number (fallback to 0 if undefined)
          ConferenceId: editedPresentation.Room?.ConferenceId ?? 0,  // Ensure ConferenceId is a valid number (fallback to 0 if undefined)
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
        ...editedPresentation,
        Room: selectedRoom,
      });
    }
  };

  const handleDateChange = (field: 'StartTime' | 'EndTime', value: string) => {
    if (!editedPresentation) return;
    setEditedPresentation({
      ...editedPresentation,
      [field]: value,
    });
  };

  const cancelLectureCreation = () => {
    console.log("Cancel Creation button clicked.");
    navigate(-1);
  }

  const createNewLecture = async () => {
    console.log('Create New Lecture button clicked.');
    
    // Ensure Room is selected
    if (!editedPresentation.Room || !editedPresentation.Room.Id) {
      setError('Please select a valid room.');
      return;
    }

    // Default speaker with ID 1 - TODO: Change this.
    const defaultSpeaker = { Id: 1, UserName: 'Default User', Email: 'default@example.com', Role: 1 };

    // Provide a fallback value for ConferenceId (0 in case no conference is selected)
    const conferenceId = editedPresentation.Conference?.Id ?? 0; // Fallback to 0 if no conference is selected

    const presentationToCreate: Presentation = {
      Id: 0, // This will be assigned by the backend
      Title: editedPresentation.Title || '',
      Description: editedPresentation.Description || '',
      Tags: editedPresentation.Tags || '',
      // TODO: Add photo.
      StartTime: editedPresentation.StartTime || '',
      EndTime: editedPresentation.EndTime || '',
      RoomId: editedPresentation.Room.Id,
      Room: editedPresentation.Room,
      SpeakerId: defaultSpeaker.Id,
      Speaker: defaultSpeaker,
      ConferenceId: conferenceId,
      Conference: editedPresentation.Conference || null,
    };

    try {
      const createdPresentation = await createPresentation(presentationToCreate, 1); // Assuming 1 is the user ID
      console.log('New Presentation created:', createdPresentation);
      navigate(-1); // Navigate back after creating the lecture
    } catch (error) {
      setError('Failed to create new lecture.');
      console.error('Error creating new lecture:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading presentation details...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
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
          value={editedPresentation.Conference?.Id?.toString() || ''}
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
          value={editedPresentation.Room?.Id?.toString() || ''}
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

      {/* Button Container */}
      <div className="button-container">
        {/* Cancel Button. */}
        <button className="cancel-button" onClick={cancelLectureCreation}>Cancel</button>
        {/* Create Button */}
        <button className="create-button" onClick={createNewLecture}>Create New Lecture</button>
      </div>
    </div>
  );
};

export default NewLecturePage;
