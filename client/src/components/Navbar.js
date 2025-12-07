import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
  <nav className="navbar">
    <h1>SkillConnect</h1>
    <div>
      <Link to="/" className="nav-link">Jobs</Link>
      
      {user ? (
        <>
          <span style={{ marginLeft: '20px', color: 'gray' }}>
             Hi, {user.name} {user.role}
          </span>
          {user.role === 'employer' && (
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
          )}
          <button onClick={handleLogout} className="btn-danger" style={{ marginLeft: '20px' }}>
            Logout
          </button>
        </>
      ) : (
        <>
          <Link to="/login" className="nav-link">Login</Link>
          <Link to="/register" className="nav-link">Register</Link>
        </>
      )}
    </div>
  </nav>
);
};

export default Navbar;