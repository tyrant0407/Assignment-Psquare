import { useState } from 'react';
import './TripForm.css';

const TripForm = ({ trip, onSubmit, onCancel, loading }) => {
    const [formData, setFormData] = useState({
        title: trip?.title || '',
        from: trip?.from || '',
        to: trip?.to || '',
        price: trip?.price || '',
        originalPrice: trip?.originalPrice || '',
        duration: trip?.duration || '',
        seatsAvailable: trip?.seatsAvailable || '',
        departureDate: trip?.departureDate || '',
        description: trip?.description || '',
        image: trip?.image || '',
        ...trip
    });

    const [errors, setErrors] = useState({});

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.title.trim()) newErrors.title = 'Title is required';
        if (!formData.from.trim()) newErrors.from = 'Departure city is required';
        if (!formData.to.trim()) newErrors.to = 'Destination city is required';
        if (!formData.price || formData.price <= 0) newErrors.price = 'Valid price is required';
        if (!formData.duration.trim()) newErrors.duration = 'Duration is required';
        if (!formData.seatsAvailable || formData.seatsAvailable <= 0) newErrors.seatsAvailable = 'Valid seat count is required';
        if (!formData.departureDate) newErrors.departureDate = 'Departure date is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            onSubmit(formData);
        }
    };

    const formatDateForInput = (date) => {
        if (!date) return '';
        return new Date(date).toISOString().split('T')[0];
    };

    return (
        <div className="trip-form-overlay">
            <div className="trip-form-container">
                <div className="trip-form-header">
                    <h2>{trip ? 'Edit Trip' : 'Create New Trip'}</h2>
                    <button className="close-btn" onClick={onCancel}>×</button>
                </div>

                <form className="trip-form" onSubmit={handleSubmit}>
                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="title">Trip Title *</label>
                            <input
                                type="text"
                                id="title"
                                value={formData.title}
                                onChange={(e) => handleInputChange('title', e.target.value)}
                                className={errors.title ? 'error' : ''}
                                placeholder="e.g., New York → Boston"
                            />
                            {errors.title && <span className="error-text">{errors.title}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="from">From *</label>
                            <input
                                type="text"
                                id="from"
                                value={formData.from}
                                onChange={(e) => handleInputChange('from', e.target.value)}
                                className={errors.from ? 'error' : ''}
                                placeholder="Departure city"
                            />
                            {errors.from && <span className="error-text">{errors.from}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="to">To *</label>
                            <input
                                type="text"
                                id="to"
                                value={formData.to}
                                onChange={(e) => handleInputChange('to', e.target.value)}
                                className={errors.to ? 'error' : ''}
                                placeholder="Destination city"
                            />
                            {errors.to && <span className="error-text">{errors.to}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="price">Price ($) *</label>
                            <input
                                type="number"
                                id="price"
                                value={formData.price}
                                onChange={(e) => handleInputChange('price', parseFloat(e.target.value))}
                                className={errors.price ? 'error' : ''}
                                placeholder="0.00"
                                min="0"
                                step="0.01"
                            />
                            {errors.price && <span className="error-text">{errors.price}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="originalPrice">Original Price ($)</label>
                            <input
                                type="number"
                                id="originalPrice"
                                value={formData.originalPrice}
                                onChange={(e) => handleInputChange('originalPrice', parseFloat(e.target.value))}
                                placeholder="0.00"
                                min="0"
                                step="0.01"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="duration">Duration *</label>
                            <input
                                type="text"
                                id="duration"
                                value={formData.duration}
                                onChange={(e) => handleInputChange('duration', e.target.value)}
                                className={errors.duration ? 'error' : ''}
                                placeholder="e.g., 5h 30min"
                            />
                            {errors.duration && <span className="error-text">{errors.duration}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="seatsAvailable">Available Seats *</label>
                            <input
                                type="number"
                                id="seatsAvailable"
                                value={formData.seatsAvailable}
                                onChange={(e) => handleInputChange('seatsAvailable', parseInt(e.target.value))}
                                className={errors.seatsAvailable ? 'error' : ''}
                                placeholder="0"
                                min="1"
                            />
                            {errors.seatsAvailable && <span className="error-text">{errors.seatsAvailable}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="departureDate">Departure Date *</label>
                            <input
                                type="date"
                                id="departureDate"
                                value={formatDateForInput(formData.departureDate)}
                                onChange={(e) => handleInputChange('departureDate', e.target.value)}
                                className={errors.departureDate ? 'error' : ''}
                                min={new Date().toISOString().split('T')[0]}
                            />
                            {errors.departureDate && <span className="error-text">{errors.departureDate}</span>}
                        </div>

                        <div className="form-group full-width">
                            <label htmlFor="image">Image URL</label>
                            <input
                                type="url"
                                id="image"
                                value={formData.image}
                                onChange={(e) => handleInputChange('image', e.target.value)}
                                placeholder="https://example.com/image.jpg"
                            />
                        </div>

                        <div className="form-group full-width">
                            <label htmlFor="description">Description</label>
                            <textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => handleInputChange('description', e.target.value)}
                                placeholder="Trip description..."
                                rows="4"
                            />
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="button" className="cancel-btn" onClick={onCancel}>
                            Cancel
                        </button>
                        <button type="submit" className="submit-btn" disabled={loading}>
                            {loading ? 'Saving...' : (trip ? 'Update Trip' : 'Create Trip')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TripForm;