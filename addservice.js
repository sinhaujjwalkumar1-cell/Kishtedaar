import React, { useState } from 'react';

const AddService = () => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Add Service: ' + title);
    // TODO: Add service API call
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Your Service</h2>
      <input type="text" placeholder="Service Title" value={title} onChange={e => setTitle(e.target.value)} required />
      <select value={category} onChange={e => setCategory(e.target.value)} required>
        <option value="">Select Category</option>
        <option value="Home Services">Home Services</option>
        <option value="Construction">Construction</option>
        <option value="Tech Support">Tech Support</option>
        <option value="Vehicle Repair">Vehicle Repair</option>
        <option value="Beauty & Care">Beauty & Care</option>
        <option value="Education">Education</option>
        <option value="Event Services">Event Services</option>
        <option value="Rental">Rental</option>
      </select>
      <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} required />
      <button type="submit">Add Service</button>
    </form>
  );
};

export default AddService;
