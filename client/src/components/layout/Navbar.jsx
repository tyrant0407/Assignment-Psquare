import { useAuth } from '../../hooks/useAuth';
import { Link, useLocation } from 'react-router';
import './Navbar.css';
import Logo from '../../assets/icons/logo.png'

const Navbar = () => {
    const { user, logout } = useAuth();
    const location = useLocation();

    // Debug: Log user data to console
    console.log('Navbar Debug - User object:', user);
    console.log('Navbar Debug - User role:', user?.role);
    console.log('Navbar Debug - Is admin?', user?.role === 'admin');

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="navbar-brand">
                    <span className="brand-icon w-10">
                        <img src={Logo} alt="" />
                    </span>
                    <span className="brand-text">Argo</span>
                </div>

                <div className="navbar-menu">
                    <Link
                        to="/"
                        className={`navbar-link ${location.pathname === '/' ? 'active' : ''}`}
                    >
                        Home
                    </Link>
                    <Link
                        to="/bookings"
                        className={`navbar-link ${location.pathname === '/bookings' ? 'active' : ''}`}
                    >
                        My Bookings
                    </Link>
                    <Link
                        to="/profile"
                        className={`navbar-link ${location.pathname.startsWith('/profile') ? 'active' : ''}`}
                    >
                        Profile
                    </Link>
                    {user?.role === 'admin' && (
                        <Link
                            to="/admin"
                            className={`navbar-link ${location.pathname === '/admin' ? 'active' : ''}`}
                        >
                            Admin
                        </Link>
                    )}

        
                </div>

                <div className="navbar-user">
                    {user ? (
                        <div className="user-menu">
                            <div className="user-avatar">
                                {user.name?.charAt(0) || 'U'}
                            </div>
                            <button onClick={logout} className="logout-btn">
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className="auth-buttons">
                            <Link to="/login" className="login-btn">Login</Link>
                            <Link to="/signup" className="signup-btn">Sign Up</Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;