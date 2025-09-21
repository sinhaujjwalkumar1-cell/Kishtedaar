const express = require('express');
const router = express.Router();
const Service = require('../models/Service');

// Fetch all active services (optionally by category)
router.get('/', async (req, res) => {
  try {
    let query = { isActive: true };
    if (req.query.category) {
      query.category = req.query.category;
    }
    const services = await Service.find(query).populate('provider');
    res.json(services);
  } catch(err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new service
router.post('/', async (req, res) => {
  try {
    const service = new Service(req.body);
    const newService = await service.save();
    res.status(201).json(newService);
  } catch(err) {
    res.status(400).json({ message: err.message });
  }
});

// TODO: Update and Delete routes can be added here similarly.

module.exports = router;
