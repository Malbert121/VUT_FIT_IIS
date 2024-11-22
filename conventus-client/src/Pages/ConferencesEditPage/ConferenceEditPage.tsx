import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getConference, updateConference } from '../../api'; // Assuming updateConference is defined
import { Conference, Room } from '../../data';
import { useUser } from '../../context/UserContext'; // Import the UserContext to access user info

const ConferenceEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = useUser(); // Get the logged-in user
  const [rooms, setRooms] = useState<Room[]>([]); // List of rooms
  const [conference, setConference] = useState<Conference | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Conference | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [dateError, setDateError] = useState<string | null>(null); // State for date validation error
  const hasPresentation = (roomId: number) => {
    // Check if any presentation is associated with the roomId
    return conference?.Presentations?.some((presentation) => presentation.RoomId === roomId);
  };
  useEffect(() => {
    const fetchConference = async () => {
      try {
        const data = await getConference(Number(id));
        if ((data?.OrganizerId !== Number(user?.id)) && (user?.role!=="Admin")) {
          setError('You are not authorized to edit this conference.');
          navigate('/'); // Redirect unauthorized users
          return;
        }
        setConference(data);
        setFormData(data);
        setRooms(data?.Rooms || []); // Initialize rooms with API response
      } catch (error) {
        setError('Failed to fetch conference details.');
      } finally {
        setLoading(false);
      }
    };

    fetchConference();
  }, [id, user?.id, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData!,
      [name]: value,
    }));
  };
  const getPresentationName = (roomId: number) => {
    const presentation = conference?.Presentations?.find((presentation) => presentation.RoomId === roomId);
    return presentation ? presentation.Title : null; // Return presentation name if found
  };
  const validateDates = () => {
    if (formData?.StartDate && formData?.EndDate) {
      const startDate = new Date(formData.StartDate);
      const endDate = new Date(formData.EndDate);
      if (startDate >= endDate) {
        setDateError('Start date must be before the end date.');
        return false;
      }
    }
    setDateError(null);
    return true;
  };


  const handleRoomChange = (index: number, field: keyof Room, value: string | number | null) => {
    const updatedRooms = [...rooms];
    updatedRooms[index] = {
      ...updatedRooms[index],
      [field]: value,
    };
    setRooms(updatedRooms);
  };

  const addRoom = () => {
    setRooms((prevRooms) => [
      ...prevRooms,
      {
        Id: 0, // временный уникальный ID для новой комнаты
        Name: "",
        ConferenceId: Number(id), // привязываем к текущей конференции
      },
    ]);
  };

  const deleteRoom = (index: number) => {
    setRooms((prevRooms) => prevRooms.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateDates()) return;

    setIsSaving(true);
    if (formData) {
      try {
        const updatedData = { ...formData, Rooms: rooms }; // Add rooms to the payload
        await updateConference(Number(id), updatedData);
        navigate(`/conferences/${id}`); // Redirect to details page
      } catch (error) {
        setError('Failed to update conference details.');
      } finally {
        setIsSaving(false);
      }
    }
  };


  if (loading) {
    return <div className="text-center text-xl">Loading conference details...</div>;
  }

  if (error) {
    return <div className="text-center text-xl text-red-500">Error: {error}</div>;
  }

  if (!conference) {
    return <div className="text-center text-xl text-red-500">Conference not found.</div>;
  }

  return (
    <div className="max-w-4xl w-full mx-auto bg-white shadow-xl rounded-lg p-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Edit Conference</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {formData?.PhotoUrl && (
            <div className="flex justify-center mt-4">
              <img
                src={formData.PhotoUrl}
                alt="URL is not correct!"
                className="max-h-64 rounded-lg shadow-lg"
              />
            </div>
          )}

          <div>

            <label className="block text-gray-700 font-medium">Photo URL</label>
            <input
              type="url"
              name="PhotoUrl"
              value={formData?.PhotoUrl || ''}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="https://example.com/photo.jpg"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Conference Name</label>
            <input
              type="text"
              name="Name"
              value={formData?.Name || ''}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Genre</label>
            <input
              type="text"
              name="Genre"
              value={formData?.Genre || ''}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Location</label>
            <input
              type="text"
              name="Location"
              value={formData?.Location || ''}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Price ($)</label>
            <input
              type="number"
              name="Price"
              value={formData?.Price || ''}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Capacity</label>
            <input
              type="number"
              name="Capacity"
              value={formData?.Capacity || ''}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-gray-700 font-medium">Description</label>
          <textarea
            name="Description"
            value={formData?.Description || ''}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Brief description of the conference"
            rows={3}
            required
          ></textarea>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 font-medium">Start Date</label>
            <input
              type="datetime-local"
              name="StartDate"
              value={formData?.StartDate || ''}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">End Date</label>
            <input
              type="datetime-local"
              name="EndDate"
              value={formData?.EndDate || ''}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div className="mt-6">
            <h2 className="text-2xl font-bold mb-4">Rooms</h2>
            {rooms.map((room, index) => {
              const presentationName = getPresentationName(room.Id); // Get the presentation name

              return (
                <div
                  key={room.Id}
                  className={`flex items-center gap-4 mb-4 p-6 rounded-lg shadow-lg transition-all duration-300 ease-in-out ${presentationName ? 'bg-yellow-50 border-l-4 border-yellow-500' : 'bg-white'}`}
                >
                  <div className="flex-grow">
                    <label htmlFor={`room-name-${room.Id}`} className="block text-gray-700 font-medium mb-1">Room Name</label>
                    <input
                      id={`room-name-${room.Id}`}
                      type="text"
                      placeholder="Room Name"
                      value={room.Name || ''}
                      onChange={(e) => handleRoomChange(index, 'Name', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex items-center gap-4">

                    <button
                      type="button"
                      onClick={() => deleteRoom(index)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      Delete
                    </button>
                  </div>

                  {presentationName && (
                    <div className="mt-2 bg-green-100 p-2 rounded-lg text-green-800 text-sm">
                      <span className="font-semibold">Presentation: </span>
                      <span>{presentationName}</span>
                    </div>
                  )}
                </div>

              );
            })}
            <button
              type="button"
              onClick={addRoom}
              className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg"
            >
              + Add Room
            </button>
          </div>

          {/* Your other form elements... */}
        </div>
        {dateError && <div className="text-red-500 text-center">{dateError}</div>}
        <button
          type="submit"
          disabled={isSaving}
          className={`w-full py-3 rounded-lg font-semibold transition ${isSaving ? 'bg-gray-400 cursor-not-allowed text-gray-700' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>

      {error && <div className="mt-4 text-center text-red-600 font-medium">{error}</div>}
    </div>
  );
};

export default ConferenceEditPage;
