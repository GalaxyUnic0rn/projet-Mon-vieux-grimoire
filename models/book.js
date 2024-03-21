const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  imageUrl: { type: String },
  year: { type: Number },
  genre: { type: String },
  ratings: [{
    userId: { type: String, required: true },
    grade: { type: Number },
  }],
  averageRating: { type: Number, default: 0 },
});

module.exports = mongoose.model('Book', bookSchema);