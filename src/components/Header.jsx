import './Header.css';

function Header() {
  return (
    <header className="header">
      <div className="header-container">
        {/* Logo Section */}
        <div className="header-logo">
          <span className="logo-text">DNV Healthcare</span>
        </div>

        {/* Profile Section */}
        <div className="header-profile">
          <div className="profile-avatar">
            <span className="profile-initials">LK</span>
          </div>
          <span className="profile-name">Lokesh Konduru</span>
        </div>
      </div>
    </header>
  );
}

export default Header;

