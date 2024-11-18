import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getConference, updateConference } from '../../api'; // Assuming updateConference is defined
import { Conference } from '../../data';
import { useUser } from '../../context/UserContext'; // Import the UserContext to access user info

const ConferenceEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = useUser(); // Get the logged-in user

  const [conference, setConference] = useState<Conference | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Conference | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  useEffect(() => {
    const fetchConference = async () => {
      try {
        const data = await getConference(Number(id));
        console.log(data?.OrganizerId);
        console.log(user?.id);
        if (data?.OrganizerId !== Number(user?.id)) { // Check if the logged-in user is the owner of the conference
          setError('You are not authorized to edit this conference.');
          navigate('/'); // Redirect to a "Forbidden" page or any other page if the user is unauthorized
          return;
        }
        setConference(data);
        setFormData(data); // Initialize form with conference data
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
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    if (formData) {
      try {
        await updateConference(Number(id), formData);
        navigate(`/conferences/${id}`); // Navigate to the conference details page after successful update
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
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-semibold mb-6">Edit Conference</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="form-group">
          <label htmlFor="name" className="block text-lg font-medium text-gray-700">Conference Name</label>
          <input
            type="text"
            id="name"
            name="Name"
            value={formData?.Name || ''}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description" className="block text-lg font-medium text-gray-700">Description</label>
          <textarea
            id="description"
            name="Description"
            value={formData?.Description || ''}
            onChange={handleInputChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="form-group">
          <label htmlFor="genre" className="block text-lg font-medium text-gray-700">Genre</label>
          <input
            type="text"
            id="genre"
            name="Genre"
            value={formData?.Genre || ''}
            onChange={handleInputChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="form-group">
          <label htmlFor="location" className="block text-lg font-medium text-gray-700">Location</label>
          <input
            type="text"
            id="location"
            name="Location"
            value={formData?.Location || ''}
            onChange={handleInputChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="form-group">
          <label htmlFor="startDate" className="block text-lg font-medium text-gray-700">Start Date</label>
          <input
            type="datetime-local"
            id="startDate"
            name="StartDate"
            value={formData?.StartDate || ''}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="form-group">
          <label htmlFor="endDate" className="block text-lg font-medium text-gray-700">End Date</label>
          <input
            type="datetime-local"
            id="endDate"
            name="EndDate"
            value={formData?.EndDate || ''}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="form-group">
          <label htmlFor="price" className="block text-lg font-medium text-gray-700">Price</label>
          <input
            type="number"
            id="price"
            name="Price"
            value={formData?.Price || ''}
            onChange={handleInputChange}
            min="0"
            step="0.01"
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="form-group">
          <label htmlFor="capacity" className="block text-lg font-medium text-gray-700">Capacity</label>
          <input
            type="number"
            id="capacity"
            name="Capacity"
            value={formData?.Capacity || ''}
            onChange={handleInputChange}
            min="0"
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button 
          type="submit" 
          disabled={isSaving} 
          className="mt-4 w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition"
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default ConferenceEditPage;
