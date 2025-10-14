import './TripCard.css';

/**
 * TripCard Component - A flexible, reusable card component for displaying trip information
 * 
 * @param {Object} trip - Trip data object
 * @param {Function} onBook - Callback function when book button is clicked
 * @param {string} width - Card width (default: "100%")
 * @param {string} height - Card height (default: "auto")
 * @param {string} imageHeight - Image height (default: "200px")
 * @param {boolean} compact - Use compact layout (default: false)
 * @param {boolean} showRating - Show rating section (default: true)
 * @param {boolean} showDetails - Show trip details section (default: true)
 * @param {string} className - Additional CSS classes
 * 
 * Usage Examples:
 * 
 * // Basic usage
 * <TripCard trip={tripData} onBook={handleBook} />
 * 
 * // Compact card for lists
 * <TripCard trip={tripData} onBook={handleBook} compact={true} width="300px" />
 * 
 * // Custom dimensions
 * <TripCard 
 *   trip={tripData} 
 *   onBook={handleBook} 
 *   width="400px" 
 *   height="500px" 
 *   imageHeight="150px" 
 * />
 * 
 * // Minimal card without rating and details
 * <TripCard 
 *   trip={tripData} 
 *   onBook={handleBook} 
 *   showRating={false} 
 *   showDetails={false} 
 * />
 */
const TripCard = ({
    trip,
    onBook,
    width = "100%",
    height = "auto",
    imageHeight = "",
    compact = true,
    showRating = true,
    showDetails = true,
    className = ""
}) => {
    const {
        title,
        from,
        to,
        price,
        originalPrice,
        duration,
        seatsAvailable,
        departureDate,
        image,
        rating = 0,
        reviewCount = 0,
        isPopular,
        discount
    } = trip;

    const formatDate = (date) => {
        if (!date) return 'Date TBD';
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const handleBookNow = () => {
        if (onBook) {
            onBook(trip);
        }
    };

    const cardStyle = {
        width,
        height,
        minHeight: compact ? '280px' : '400px'
    };

    const imageStyle = {
        height: imageHeight
    };

    return (
        <div
            className={`trip-card ${compact ? 'trip-card--compact' : ''} ${className}`}
            style={cardStyle}
        >
            <div className="trip-card-image" style={imageStyle}>
                <img
                    src={image || 'https://via.placeholder.com/300x200?text=No+Image'}
                    alt={title || 'Trip'}
                />
                {isPopular && <span className="badge popular">Popular</span>}
                {discount && <span className="badge discount">{discount}% OFF</span>}
            </div>

            <div className="trip-card-content">
                {showRating && rating > 0 && (
                    <div className="trip-rating">
                        <div className="stars">
                            {[...Array(5)].map((_, i) => (
                                <span key={i} className={`star ${i < Math.floor(rating) ? 'filled' : ''}`}>
                                    ⭐
                                </span>
                            ))}
                        </div>
                        {reviewCount > 0 && (
                            <span className="review-count">({reviewCount} reviews)</span>
                        )}
                    </div>
                )}

                <h3 className="trip-title">{title || `${from} → ${to}`}</h3>
                <p className="trip-route">{from} → {to}</p>

                {showDetails && (
                    <div className="trip-details">
                        {duration && (
                            <div className="detail-item">
                                <span className="icon"><svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M7 0.75C8.85652 0.75 10.637 1.4875 11.9497 2.80025C13.2625 4.11301 14 5.89348 14 7.75C14 9.60652 13.2625 11.387 11.9497 12.6997C10.637 14.0125 8.85652 14.75 7 14.75C5.14348 14.75 3.36301 14.0125 2.05025 12.6997C0.737498 11.387 0 9.60652 0 7.75C0 5.89348 0.737498 4.11301 2.05025 2.80025C3.36301 1.4875 5.14348 0.75 7 0.75ZM6.34375 4.03125V7.75C6.34375 7.96875 6.45312 8.17383 6.63633 8.29688L9.26133 10.0469C9.56211 10.2492 9.96953 10.1672 10.1719 9.86367C10.3742 9.56016 10.2922 9.15547 9.98867 8.95312L7.65625 7.4V4.03125C7.65625 3.66758 7.36367 3.375 7 3.375C6.63633 3.375 6.34375 3.66758 6.34375 4.03125Z" fill="#4B5563" />
                                </svg>
                                </span>
                                <span>{duration}</span>
                            </div>
                        )}
                        {seatsAvailable && (
                            <div className="detail-item">
                                <span className="icon">
                                    <svg width="18" height="15" viewBox="0 0 18 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M3.9375 0.75C4.51766 0.75 5.07406 0.980468 5.4843 1.3907C5.89453 1.80094 6.125 2.35734 6.125 2.9375C6.125 3.51766 5.89453 4.07406 5.4843 4.4843C5.07406 4.89453 4.51766 5.125 3.9375 5.125C3.35734 5.125 2.80094 4.89453 2.3907 4.4843C1.98047 4.07406 1.75 3.51766 1.75 2.9375C1.75 2.35734 1.98047 1.80094 2.3907 1.3907C2.80094 0.980468 3.35734 0.75 3.9375 0.75ZM14 0.75C14.5802 0.75 15.1366 0.980468 15.5468 1.3907C15.957 1.80094 16.1875 2.35734 16.1875 2.9375C16.1875 3.51766 15.957 4.07406 15.5468 4.4843C15.1366 4.89453 14.5802 5.125 14 5.125C13.4198 5.125 12.8634 4.89453 12.4532 4.4843C12.043 4.07406 11.8125 3.51766 11.8125 2.9375C11.8125 2.35734 12.043 1.80094 12.4532 1.3907C12.8634 0.980468 13.4198 0.75 14 0.75ZM0 8.91758C0 7.30703 1.30703 6 2.91758 6H4.08516C4.51992 6 4.93281 6.0957 5.30469 6.26523C5.26914 6.46211 5.25273 6.66719 5.25273 6.875C5.25273 7.91953 5.71211 8.85742 6.43672 9.5C6.43125 9.5 6.42578 9.5 6.41758 9.5H0.582422C0.2625 9.5 0 9.2375 0 8.91758ZM11.0824 9.5C11.077 9.5 11.0715 9.5 11.0633 9.5C11.7906 8.85742 12.2473 7.91953 12.2473 6.875C12.2473 6.66719 12.2281 6.46484 12.1953 6.26523C12.5672 6.09297 12.9801 6 13.4148 6H14.5824C16.193 6 17.5 7.30703 17.5 8.91758C17.5 9.24023 17.2375 9.5 16.9176 9.5H11.0824ZM6.125 6.875C6.125 6.17881 6.40156 5.51113 6.89384 5.01884C7.38613 4.52656 8.05381 4.25 8.75 4.25C9.44619 4.25 10.1139 4.52656 10.6062 5.01884C11.0984 5.51113 11.375 6.17881 11.375 6.875C11.375 7.57119 11.0984 8.23887 10.6062 8.73116C10.1139 9.22344 9.44619 9.5 8.75 9.5C8.05381 9.5 7.38613 9.22344 6.89384 8.73116C6.40156 8.23887 6.125 7.57119 6.125 6.875ZM3.5 14.0199C3.5 12.0074 5.13242 10.375 7.14492 10.375H10.3551C12.3676 10.375 14 12.0074 14 14.0199C14 14.4219 13.6746 14.75 13.2699 14.75H4.23008C3.82812 14.75 3.5 14.4246 3.5 14.0199Z" fill="#4B5563" />
                                    </svg>
                                </span>
                                <span>{seatsAvailable} seats available</span>
                            </div>
                        )}
                        {departureDate && (
                            <div className="detail-item">
                                <span className="icon">
                                    <svg width="18" height="15" viewBox="0 0 18 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M3.9375 0.75C4.51766 0.75 5.07406 0.980468 5.4843 1.3907C5.89453 1.80094 6.125 2.35734 6.125 2.9375C6.125 3.51766 5.89453 4.07406 5.4843 4.4843C5.07406 4.89453 4.51766 5.125 3.9375 5.125C3.35734 5.125 2.80094 4.89453 2.3907 4.4843C1.98047 4.07406 1.75 3.51766 1.75 2.9375C1.75 2.35734 1.98047 1.80094 2.3907 1.3907C2.80094 0.980468 3.35734 0.75 3.9375 0.75ZM14 0.75C14.5802 0.75 15.1366 0.980468 15.5468 1.3907C15.957 1.80094 16.1875 2.35734 16.1875 2.9375C16.1875 3.51766 15.957 4.07406 15.5468 4.4843C15.1366 4.89453 14.5802 5.125 14 5.125C13.4198 5.125 12.8634 4.89453 12.4532 4.4843C12.043 4.07406 11.8125 3.51766 11.8125 2.9375C11.8125 2.35734 12.043 1.80094 12.4532 1.3907C12.8634 0.980468 13.4198 0.75 14 0.75ZM0 8.91758C0 7.30703 1.30703 6 2.91758 6H4.08516C4.51992 6 4.93281 6.0957 5.30469 6.26523C5.26914 6.46211 5.25273 6.66719 5.25273 6.875C5.25273 7.91953 5.71211 8.85742 6.43672 9.5C6.43125 9.5 6.42578 9.5 6.41758 9.5H0.582422C0.2625 9.5 0 9.2375 0 8.91758ZM11.0824 9.5C11.077 9.5 11.0715 9.5 11.0633 9.5C11.7906 8.85742 12.2473 7.91953 12.2473 6.875C12.2473 6.66719 12.2281 6.46484 12.1953 6.26523C12.5672 6.09297 12.9801 6 13.4148 6H14.5824C16.193 6 17.5 7.30703 17.5 8.91758C17.5 9.24023 17.2375 9.5 16.9176 9.5H11.0824ZM6.125 6.875C6.125 6.17881 6.40156 5.51113 6.89384 5.01884C7.38613 4.52656 8.05381 4.25 8.75 4.25C9.44619 4.25 10.1139 4.52656 10.6062 5.01884C11.0984 5.51113 11.375 6.17881 11.375 6.875C11.375 7.57119 11.0984 8.23887 10.6062 8.73116C10.1139 9.22344 9.44619 9.5 8.75 9.5C8.05381 9.5 7.38613 9.22344 6.89384 8.73116C6.40156 8.23887 6.125 7.57119 6.125 6.875ZM3.5 14.0199C3.5 12.0074 5.13242 10.375 7.14492 10.375H10.3551C12.3676 10.375 14 12.0074 14 14.0199C14 14.4219 13.6746 14.75 13.2699 14.75H4.23008C3.82812 14.75 3.5 14.4246 3.5 14.0199Z" fill="#4B5563" />
                                    </svg>

                                </span>
                                <span>{formatDate(departureDate)}</span>
                            </div>
                        )}
                    </div>
                )}

                <div className="trip-footer">
                    <div className="price-section">
                        <span className="current-price">${price || 0}</span>
                        {originalPrice && originalPrice > price && (
                            <span className="original-price">${originalPrice}</span>
                        )}
                    </div>
                    <button className="book-btn" onClick={handleBookNow}>
                        Book Now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TripCard;