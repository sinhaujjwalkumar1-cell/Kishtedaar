import React from 'react';
import { FaHome, FaTools, FaLaptop, FaCar, FaSpa, FaGraduationCap, FaGlassCheers, FaKey } from 'react-icons/fa';

const categories = [
  { key: 'home', name: 'Home Services', icon: <FaHome /> },
  { key: 'construction', name: 'Construction', icon: <FaTools /> },
  { key: 'tech', name: 'Tech Support', icon: <FaLaptop /> },
  { key: 'vehicle', name: 'Vehicle Repair', icon: <FaCar /> },
  { key: 'beauty', name: 'Beauty & Care', icon: <FaSpa /> },
  { key: 'education', name: 'Education', icon: <FaGraduationCap /> },
  { key: 'event', name: 'Event Services', icon: <FaGlassCheers /> },
  { key: 'rental', name: 'Rental', icon: <FaKey /> },
];

const Categories = ({ onCategorySelect }) => {
  return (
    <section>
      <div className="section-title">
        <span>Popular Categories</span>
        <span className="view-all" onClick={() => onCategorySelect(null)}>View All</span>
      </div>
      <div className="categories">
        {categories.map(({ key, name, icon }) => (
          <div key={key} className="category-item" onClick={() => onCategorySelect(key)}>
            <div className="category-icon">{icon}</div>
            <div className="category-name">{name}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Categories;
