import React from 'react';
import { FaHandsHelping, FaMapMarkerAlt, FaBell } from 'react-icons/fa';

const Header = ({ location = "Mihijam", notificationCount = 0 }) => {
  return (
    <header className="header">
      <div className="logo">
        <FaHandsHelping style={{ marginRight: '8px' }} />
        Service by Local
      </div>
      <div className="location-selector">
        <FaMapMarkerAlt style={{ marginRight: '8px' }} />
        <span>{location}</span>
      </div>
      <div className="icon-button" title="Notifications">
        <FaBell />
        {notificationCount > 0 && <span className="notification-badge">{notificationCount}</span>}
      </div>
    </header>
  );
};

export default Header;
