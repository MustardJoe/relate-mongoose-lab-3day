const mongoose = require('mongoose');

const actorSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  dob: Date,
  birthLocation: String,
});

module.exports = mongoose.model('Actor', actorSchema);
