import React, { useState, useEffect } from 'react';
import Header from './Header';
import Categories from './Categories';
import ServiceCard from './ServiceCard';
import axios from 'axios';

const Home = () => {
  const [location, setLocation] = useState('Mihijam');
  const [categoriesFilter, setCategoriesFilter] = useState(null);
  const [services, setServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchServices();
  }, [categoriesFilter]);

  const fetchServices = async () => {
    try {
      let url = '/api/services';
      if (categoriesFilter) url += `?category=${categoriesFilter}`;
      const res = await axios.get(url);
      setServices(res.data);
    } catch (err) {
      console.error('Error fetching services', err);
    }
  };

  const handleServiceClick = (service) => {
    alert('Open service details: ' + service.title);
    // TODO: Redirect to Service Detail
  };

  return (
    <div>
      <Header location={location} notificationCount={3} />
      <div className="search-container">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search for services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <Categories onCategorySelect={setCategoriesFilter} />
      <section className="section-title">
        <span>Services Near You</span>
      </section>
      <div className="services-grid">
        {services.filter(s => s.title.toLowerCase().includes(searchTerm.toLowerCase())).map(service => (
          <ServiceCard key={service._id || service.id} service={service} onClick={handleServiceClick} />
        ))}
      </div>
    </div>
  );
};

export default Home;
