import { useState } from 'react';
import './TripFilter.css';

const TripFilter = ({ onSearch, loading }) => {
    const [filters, setFilters] = useState({
        from: '',
        to: '',
        date: ''
    });

    const handleInputChange = (field, value) => {
        setFilters(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (onSearch) {
            onSearch(filters);
        }
    };

    const formatDateForInput = (date) => {
        if (!date) return '';
        return new Date(date).toISOString().split('T')[0];
    };

    return (
        <div className="trip-filter">
            <form className="filter-form" onSubmit={handleSearch}>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="from">From</label>
                        <div className="input-wrapper">
                            <input
                                type="text"
                                id="from"
                                placeholder="Departure Location"
                                value={filters.from}
                                onChange={(e) => handleInputChange('from', e.target.value)}
                                required
                            />
                            <span className="input-icon"><svg width="18" height="23" viewBox="0 0 18 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7.115 20.811C7.721 21.311 8.353 21.768 9 22.214C9.6484 21.7739 10.2773 21.3058 10.885 20.811C11.898 19.9792 12.8513 19.0773 13.738 18.112C15.782 15.877 18 12.637 18 9C18 7.8181 17.7672 6.64778 17.3149 5.55585C16.8626 4.46392 16.1997 3.47177 15.364 2.63604C14.5282 1.80031 13.5361 1.13738 12.4442 0.685084C11.3522 0.232792 10.1819 0 9 0C7.8181 0 6.64778 0.232792 5.55585 0.685084C4.46392 1.13738 3.47177 1.80031 2.63604 2.63604C1.80031 3.47177 1.13738 4.46392 0.685084 5.55585C0.232792 6.64778 -1.76116e-08 7.8181 0 9C0 12.637 2.218 15.876 4.262 18.112C5.14862 19.0777 6.10196 19.9789 7.115 20.811ZM9 12.25C8.13805 12.25 7.3114 11.9076 6.7019 11.2981C6.09241 10.6886 5.75 9.86195 5.75 9C5.75 8.13805 6.09241 7.3114 6.7019 6.7019C7.3114 6.09241 8.13805 5.75 9 5.75C9.86195 5.75 10.6886 6.09241 11.2981 6.7019C11.9076 7.3114 12.25 8.13805 12.25 9C12.25 9.86195 11.9076 10.6886 11.2981 11.2981C10.6886 11.9076 9.86195 12.25 9 12.25Z" fill="#ADAEBC" />
                            </svg>
                            </span>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="to">To</label>
                        <div className="input-wrapper">
                            <input
                                type="text"
                                id="to"
                                placeholder="Arrival Location"
                                value={filters.to}
                                onChange={(e) => handleInputChange('to', e.target.value)}
                                required
                            />
                            <span className="input-icon"><svg width="18" height="23" viewBox="0 0 18 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7.115 20.811C7.721 21.311 8.353 21.768 9 22.214C9.6484 21.7739 10.2773 21.3058 10.885 20.811C11.898 19.9792 12.8513 19.0773 13.738 18.112C15.782 15.877 18 12.637 18 9C18 7.8181 17.7672 6.64778 17.3149 5.55585C16.8626 4.46392 16.1997 3.47177 15.364 2.63604C14.5282 1.80031 13.5361 1.13738 12.4442 0.685084C11.3522 0.232792 10.1819 0 9 0C7.8181 0 6.64778 0.232792 5.55585 0.685084C4.46392 1.13738 3.47177 1.80031 2.63604 2.63604C1.80031 3.47177 1.13738 4.46392 0.685084 5.55585C0.232792 6.64778 -1.76116e-08 7.8181 0 9C0 12.637 2.218 15.876 4.262 18.112C5.14862 19.0777 6.10196 19.9789 7.115 20.811ZM9 12.25C8.13805 12.25 7.3114 11.9076 6.7019 11.2981C6.09241 10.6886 5.75 9.86195 5.75 9C5.75 8.13805 6.09241 7.3114 6.7019 6.7019C7.3114 6.09241 8.13805 5.75 9 5.75C9.86195 5.75 10.6886 6.09241 11.2981 6.7019C11.9076 7.3114 12.25 8.13805 12.25 9C12.25 9.86195 11.9076 10.6886 11.2981 11.2981C10.6886 11.9076 9.86195 12.25 9 12.25Z" fill="#ADAEBC" />
                            </svg>
                            </span>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="date">Date</label>
                        <div className="input-wrapper">
                            <input
                                type="date"
                                id="date"
                                placeholder="mm/dd/yyyy"
                                value={formatDateForInput(filters.date)}
                                onChange={(e) => handleInputChange('date', e.target.value)}
                                min={new Date().toISOString().split('T')[0]}
                                required
                            />
                            <span className="input-icon"><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M0 17C0 18.7 1.3 20 3 20H17C18.7 20 20 18.7 20 17V9H0V17ZM17 2H15V1C15 0.4 14.6 0 14 0C13.4 0 13 0.4 13 1V2H7V1C7 0.4 6.6 0 6 0C5.4 0 5 0.4 5 1V2H3C1.3 2 0 3.3 0 5V7H20V5C20 3.3 18.7 2 17 2Z" fill="#ADAEBC" />
                            </svg>
                            </span>
                        </div>
                    </div>

                    <button type="submit" className="search-btn" disabled={loading}>
                        {loading ? 'Searching...' : 'Search Trips'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TripFilter;