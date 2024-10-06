import React, { useEffect, useState } from 'react';
import './Conferences.css'; // Import the CSS file

interface Conference {
    Id: number;
    Name: string | null;
    Description: string | null;
    Genre: string | null;
    Location: string | null;
    StartDate: string;
    EndDate: string;
    Price: number;
    Capacity: number;
    Presentations: any[]; 
    Reservations: any[]; 
    OrganizerId: number; 
    Organizer: User | null; 
}

interface User {
    Id: number; 
    Name: string; 
}

const Conferences: React.FC = () => {
    const [conferences, setConferences] = useState<Conference[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [sortOption, setSortOption] = useState<string>('startDate'); // Default sorting by Start Date

    const parseDate = (dateString: string) => {
        const parsedDate = new Date(dateString);
        return isNaN(parsedDate.getTime()) ? 'Unknown date' : parsedDate.toLocaleDateString();
    };

    useEffect(() => {
        fetch('https://localhost:7156/api/conferences') 
            .then((response) => response.json())
            .then((data: Conference[]) => {
                console.log(data);
                setConferences(data);
            })
            .catch((error) => console.error('Error:', error));
    }, []);

    // Filter conferences based on the search term
    const filteredConferences = conferences.filter(conference => 
        conference.Name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        conference.Description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort conferences based on the selected option
    const sortedConferences = filteredConferences.sort((a, b) => {
        if (sortOption === 'startDate') {
            return new Date(a.StartDate).getTime() - new Date(b.StartDate).getTime();
        } else if (sortOption === 'price') {
            return a.Price - b.Price;
        }
        return 0; // Default case
    });

    return (
        <div className="conference-container">
            <h1>Conference List</h1>
            <input
                type="text"
                placeholder="Search by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
            />
            <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="sort-select"
            >
                <option value="startDate">Sort by Start Date</option>
                <option value="price">Sort by Price</option>
            </select>
            <ul className="conference-list">
                {sortedConferences.map((conference) => (
                    <li key={conference.Id} className="conference-item">
                        <h2 className="conference-title">{conference.Name || 'No title'}</h2>
                        <p><strong>Description:</strong> {conference.Description || 'No description'}</p>
                        <p><strong>Genre:</strong> {conference.Genre || 'No genre'}</p>
                        <p><strong>Location:</strong> {conference.Location || 'No location'}</p>
                        <p><strong>Start Date:</strong> {parseDate(conference.StartDate)}</p>
                        <p><strong>End Date:</strong> {parseDate(conference.EndDate)}</p>
                        <p><strong>Price:</strong> ${conference.Price}</p>
                        <p><strong>Capacity:</strong> {conference.Capacity} participants</p>
                        <p><strong>Organizer:</strong> {conference.Organizer?.Name || 'Unknown organizer'}</p>
                        <hr />
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Conferences;
