const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  phone: { type: String, unique: true },
  email: { type: String, unique: true, sparse: true },
  password: String,
  googleId: String,
  facebookId: String,
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: [Number]  // [longitude, latitude]
  },
  createdAt: { type: Date, default: Date.now }
});

UserSchema.index({ location: "2dsphere" });

module.exports = mongoose.model('User', UserSchema);
