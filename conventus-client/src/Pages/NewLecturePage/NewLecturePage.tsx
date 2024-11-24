import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { createPresentation, getAllRooms, getAllUsers } from '../../api';
import { Presentation, Room, User } from '../../data';
import { useUser } from '../../context/UserContext';
import './NewLecturePage.css';

type PartialPresentation = Partial<Presentation>; // TODO: WTF???

const NewLecturePage: React.FC = () => {
  const user = useUser();
  const navigate = useNavigate();
  const {state} = useLocation();
  if(!state){
    navigate('/');
  }
  const [editedPresentation, setEditedPresentation] = useState<PartialPresentation>({
    Title: '',
    Description: '',
    Tags: '',
    StartTime: '',
    EndTime: '',
    SpeakerId: 0,
    Speaker: undefined,
    ConferenceId: state.id,
  });
  const [rooms, setRooms] = useState<Room[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false); // State to control submit button
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]); // Filtered users for dropdown
  const [searchTerm, setSearchTerm] = useState<string | null>(''); // Allow null
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false); // Toggle suggestions dropdown
  const handleSelectUser = (selectedUser: User) => {
    setEditedPresentation({
      ...editedPresentation,
      SpeakerId: selectedUser.Id,
      Speaker: selectedUser,
    });
    setSearchTerm(selectedUser.UserName); // Update input with selected user's login
    setShowSuggestions(false); // Hide suggestions
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const term = e.target.value.toLowerCase();
  setSearchTerm(term); // Обновляем состояние для ввода
  setFilteredUsers(
    users.filter(user => user.UserName?.toLowerCase().includes(term)) // Фильтруем список
  );
};

  useEffect(() => {
    const fetchData = async () => {
      try {
        if(!user){
          navigate('/');
        }
        const roomsData = await getAllRooms();  
        const usersData = await getAllUsers();
        setRooms(roomsData?.filter(r=>r.ConferenceId === state?.Id) || []);
        setUsers(usersData || []);
      } catch (error) {
        setError('Failed to fetch data for the new lecture.');
        console.error('Error fetching data:', error);
        navigate('/');
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (field: keyof Presentation, value: any) => {
    if (!editedPresentation) return;
    setEditedPresentation({
      ...editedPresentation,
      [field]: value,
    });
  };

  const handleRoomChange = (roomId: number) => {
    const selectedRoom = rooms.find(room => room.Id === roomId);
    if (selectedRoom) {
      setEditedPresentation({
        ...editedPresentation!,
        RoomId: roomId,
        Room: selectedRoom,
      });
    }
  }

  const handleSpeakerChange = (userId: number) => {
    const selectedSpeaker = users.find(u=>u.Id=== userId);
    if(selectedSpeaker){
      setEditedPresentation({
        ...editedPresentation!,
        SpeakerId: userId,
        Speaker: selectedSpeaker
      })
    }
  }

  const handleDateChange = (field: 'StartTime' | 'EndTime', value: string) => {
    if (!editedPresentation) return;
    setEditedPresentation({
      ...editedPresentation,
      [field]: value,
    });
  };

  const createNewLecture = async () => {
    console.log('Create New Lecture button clicked.');
    
    // Ensure Room is selected
    if (!editedPresentation.Room || !editedPresentation.Room.Id) {
      setErrorMessage('Please select a valid room.');
      setSuccessMessage(null);
      return;
    }
    const presentationToCreate: Presentation = {
      Id: 0,
      Title: editedPresentation.Title || '',
      Description: editedPresentation.Description || '',
      Tags: editedPresentation.Tags || '',
      // TODO: Add photo.
      StartTime: editedPresentation.StartTime || '',
      EndTime: editedPresentation.EndTime || '',
      RoomId: editedPresentation.Room.Id,
      Room: editedPresentation.Room,
      SpeakerId: (Number(user?.id) === state?.OrganizerId || user?.role === 'Admin')? (editedPresentation.SpeakerId ?? 0)
      : (user?.id ? Number(user.id) : 0),
      Speaker: null,
      ConferenceId: state?.Id,
      Conference: null,
      PhotoUrl: editedPresentation.PhotoUrl,
    };
    console.log(presentationToCreate);
    try {
      await createPresentation(presentationToCreate, Number(user?.id));
      setSuccessMessage("Presentation created successfully!");
      setErrorMessage(null);
      setIsSubmitDisabled(true);
      setTimeout(() => {
          navigate(-1); // Go back to the previous page
      }, 2000)
    } catch (error:any) {
      setErrorMessage((error as Error).message);
      setSuccessMessage(null);
      console.error("Error creating conference:", error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createNewLecture();
  };

  return (
    <div className="presentation-detail">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="input-container">
        <label className="font-bold text-gray-800">Conference:</label>
        <span className="text-gray-800">{state?.Name || ''}</span>
        </div>
        <div className="input-container">
        <label className="font-bold text-gray-800">Conference Start Date:</label>
        <span className="text-gray-800">{state?.StartDate || ''}</span>
        </div>
        <div className="input-container">
        <label className="font-bold text-gray-800">Conference End Date:</label>
        <span className="text-gray-800">{state?.EndDate || ''}</span>
        </div>
        <div className="input-container">
          <label>Title:</label>
          <input
            className="input-field"
            type="text"
            value={editedPresentation.Title || ''}
            onChange={(e) => handleInputChange('Title', e.target.value)}
            required
          />
        </div>
        {(Number(user?.id) === state?.OrganizerId || user?.role === 'Admin') ? (
  <div className="input-container">
    <label>Speaker:</label>
    <div className="relative">
      {/* Input field for search and selection */}
      <input
        type="text"
        placeholder="Type to search by login"
        className="input-field"
        value={searchTerm!} 
        onChange={handleSearchChange}
        onFocus={() => setShowSuggestions(true)} 
        required
      />
      {/* Suggestions dropdown */}
      {showSuggestions && filteredUsers.length > 0 && (
        <ul className="absolute bg-white border rounded shadow max-h-40 overflow-y-auto z-10 w-full">
          {filteredUsers.map(user => (
            <li
              key={user.Id}
              className="cursor-pointer p-2 hover:bg-gray-200"
              onClick={() => handleSelectUser(user)}
            >
              {user.UserName}
            </li>
          ))}
        </ul>
      )}
    </div>
  </div>
) : (
  <div className="input-container">
    <label className="font-bold text-gray-800">Speaker:</label>
    <span className="text-gray-800">{user?.username || ''}</span>
  </div>
)}
        {/* Description Input */}
        <div className="input-container">
          <label>Description:</label>
          <textarea
            className="input-field presentation-description"
            value={editedPresentation.Description || ''}
            onChange={(e) => handleInputChange('Description', e.target.value)}
            required
          />
        </div>

        {/* Tags Input */}
        <div className="input-container">
          <label>Tags:</label>
          <input
            className="input-field"
            value={editedPresentation.Tags || ''}
            onChange={(e) => handleInputChange('Tags', e.target.value)}
            required
          />
        </div>

        <div className="input-container">
          <label>PhotoUrl:</label>
          <input
            className="input-field"
            value={editedPresentation.PhotoUrl || ''}
            onChange={(e) => handleInputChange('PhotoUrl', e.target.value)}
            required
          />
        </div>

        {/* Room Selection */}
        <div className="input-container">
          <label>Room:</label>
          <select
            className="input-field"
            value={editedPresentation.Room?.Id?.toString() || ''}
            onChange={(e) => handleRoomChange(Number(e.target.value))}
            required
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
            required
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
            required
          />
        </div>

        <button
            type="submit"
            className={`w-full py-3 rounded-lg font-semibold transition ${isSubmitDisabled
                ? "bg-gray-400 cursor-not-allowed text-gray-700"
                : "bg-blue-500 hover:bg-blue-600 text-white"
                }`}
            disabled={isSubmitDisabled}
        >
            {isSubmitDisabled ? "Thanks For Using Our Service" : "Create Presentation"}
        </button>
      </form>
      
      {successMessage && (
            <div className="mt-6 text-center text-green-600 font-medium">{successMessage}</div>
        )}
        {errorMessage && (
            <div className="mt-6 text-center text-red-600 font-medium">{errorMessage}</div>
      )}
    </div>
  );
};

export default NewLecturePage;
