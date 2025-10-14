import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import TripFilter from '../../components/trips/TripFilter';
import TripCard from '../../components/trips/TripCard';
import { useTrips } from '../../hooks/useTrips';
import { useAuth } from '../../hooks/useAuth';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    trips,
    searchResults,
    loading,
    error,
    getTrips,
    searchTrips,
    clearTripSearchResults
  } = useTrips();

  const [searchPerformed, setSearchPerformed] = useState(false);

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    try {
      await getTrips();
    } catch (error) {
      console.error('Failed to load trips:', error);
    }
  };

  const handleSearch = async (filters) => {
    setSearchPerformed(true);
    try {
      await searchTrips(filters);
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  const handleBookTrip = (trip) => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate(`/book/${trip._id || trip.id}`);
  };

  const displayTrips = searchPerformed ? searchResults : trips;

  return (
    <div className="home-page">
      <Navbar />

      <main className="main-content">
        <section className="hero-section">
          <div className="hero-content">
            <h1>Find Your Next Journey</h1>
            <p>Discover available trips and book your seats with ease.</p>
          </div>
          <TripFilter onSearch={handleSearch} loading={loading} />
        </section>

        <section className="trips-section">
          <div className="container">
            <div className="section-header">
              <h2>Available Trips</h2>
              <p>Choose from our carefully selected destinations and enjoy a comfortable journey.</p>
            </div>

            {loading && (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Loading trips...</p>
              </div>
            )}

            {error && (
              <div className="error-state">
                <p>Error: {error}</p>
                <button onClick={loadTrips} className="retry-btn">
                  Try Again
                </button>
              </div>
            )}

            {!loading && displayTrips.length === 0 && (
              <div className="empty-state">
                <h3>{searchPerformed ? 'No trips found' : 'No trips available'}</h3>
                <p>
                  {searchPerformed
                    ? 'Try adjusting your search criteria or check back later.'
                    : 'There are currently no trips available. Please check back later or contact support.'
                  }
                </p>
                {searchPerformed && (
                  <button
                    onClick={() => {
                      setSearchPerformed(false);
                      clearTripSearchResults();
                    }}
                    className="clear-search-btn"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            )}

            {!loading && displayTrips.length > 0 && (
              <div className="trips-grid">
                {displayTrips.map((trip) => (
                  <TripCard
                    key={trip.id}
                    trip={trip}
                    onBook={handleBookTrip}
                    width="100%"
                    height="auto"
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
