import React, { useState } from "react";
import './SearchBar.css';

interface SearchBarProps {
    onSearch: (filters: { keyword: string; speaker: string; date: string; time: string }) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
    const [keyword, setKeyword] = useState('');
    const [speaker, setSpeaker] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');

    const handleSearch = () => {
        onSearch({ keyword, speaker, date, time });
    };

    return (
        <div className="search-bar">
            <input
                type="text"
                placeholder="Key words"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
            />
            <input
                type="text"
                placeholder="Speaker"
                value={speaker}
                onChange={(e) => setSpeaker(e.target.value)}
            />
            <input
                type="date"
                placeholder="dd/MM/YYYY"
                value={date}
                onChange={(e) => setDate(e.target.value)}
            />
            <input
                type="time"
                placeholder="00:00"
                value={time}
                onChange={(e) => setTime(e.target.value)}
            />
            <button onClick={handleSearch}>Search</button>
        </div>
    );
};

export default SearchBar;
