const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
	title: String,
	date: String,
  category: String,
  body: String,
  tags: [String],
  image: String,
});

const Blog = mongoose.model('Blog', blogSchema);
module.exports = Blog;