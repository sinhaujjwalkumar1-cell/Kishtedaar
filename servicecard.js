import React from 'react';
import { FaStar, FaMapMarkerAlt, FaPhone } from 'react-icons/fa';

const ServiceCard = ({ service, onClick }) => {
  return (
    <div className="service-card" onClick={() => onClick(service)}>
      <div
        className="service-image"
        style={{ backgroundImage: `url(${service.photo || 'https://placehold.co/600x400/2ecc71/white?text=Service+Image'})` }}
      >
        <div className="rating">
          <FaStar />
          <span>{service.rating?.toFixed(1) || 'N/A'}</span>
        </div>
      </div>
      <div className="service-details">
        <div className="service-name">{service.title}</div>
        <div className="service-meta">
          <div className="distance">
            <FaMapMarkerAlt />
            <span>{service.distance || 'N/A'}</span>
          </div>
          <button className="call-button" onClick={(e) => { e.stopPropagation(); alert('Call feature coming soon'); }}>
            <FaPhone />
          </button>
        </div>
        <div className="provider-info">
          <div className="provider-avatar">{service.provider?.name?.charAt(0)}</div>
          <div className="provider-details">
            <div className="provider-name">{service.provider?.name || 'Provider'}</div>
            <div className="provider-address">{service.provider?.locationName || 'Location'}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
