const mongoose = require('mongoose');

const filmSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  studio: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'studio',
    required: true
  },
  released: {
    type: Number,
    required: true,
    min: 1850,
    max: 2050,
  },
  cast: [
    { role: {
      type: String,
    },
    actor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Actor',
      required: true
    } }]


});

module.exports = mongoose.model('Film', filmSchema);
