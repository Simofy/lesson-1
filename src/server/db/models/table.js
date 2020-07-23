const mongoose = require('mongoose');

const Table = mongoose.model(
  'Table',
  new mongoose.Schema({
    _id: Number,
    random: String,
    text: String,
    test: String,
  })
);

module.exports = Table;
