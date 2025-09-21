const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
  title: String,
  description: String,
  category: String,
  provider: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  photos: [String],
  price: Number,
  location: {
    type: { type: String, default: 'Point' },
    coordinates: [Number]
  },
  isActive: { type: Boolean, default: true },
  ratings: [{ user: mongoose.Schema.Types.ObjectId, rating: Number }],
  analytics: {
    views: { type: Number, default: 0 },
    contacts: { type: Number, default: 0 }
  },
  createdAt: { type: Date, default: Date.now }
});

ServiceSchema.index({ location: "2dsphere" });

module.exports = mongoose.model('Service', ServiceSchema);
