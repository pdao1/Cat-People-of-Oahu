const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const petFinder = require('./petFinder');
const Blog = require('./models/blogSchema');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3000;
const router = express.Router();
const cors = require('cors');
// Connect to the database
mongoose.connect('mongodb+srv://phungdao:catsarepure123@catpeopleofoahu.eccsjfp.mongodb.net/cpo-web', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Database connected successfully');
})
.catch((error) => {
  console.error(error);
});

// Middleware to check if user is logged in
const isLoggedIn = (req, res, next) => {
  if (req.session.isLoggedIn) {
    next();
  } else {
    res.redirect('/login');
  }
};

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());  // use CORS middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));

// Serve static files from the 'dist' folder
app.use(express.static(path.join(__dirname, '..', 'dist')));

app.get('/', (req, res) => {
  const indexPath = path.join(__dirname, '..', 'dist', 'index.html');
  res.sendFile(indexPath);
});

app.get('/admin', isLoggedIn, (req, res) => {
  const adminHtmlPath = path.join(__dirname, '..', 'dist', 'admin.html');
  res.sendFile(adminHtmlPath);
});

app.post('/admin', (req, res) => {
  if (req.body.username === 'admin' && req.body.password === 'password') {
    req.session.isLoggedIn = true;
    res.redirect('/admin');
  } else {
    res.send('Invalid login credentials');
  }
});

app.get('/dashboard', isLoggedIn, (req, res) => {
  const dashboardPath = path.join(__dirname, '..', 'dist', 'dashboard.html');
  res.sendFile(dashboardPath);
});

app.post('/dashboard', (req, res) => {
  if (req.body.username === 'admin' && req.body.password === 'password') {
    req.session.isLoggedIn = true;
    res.redirect('/dashboard');
  } else {
    res.send('Invalid login credentials');
  }
});

app.get('/api/blogs', async (req, res) => {
  try {
    const blogs = await Blog.find({});
    res.json(blogs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.get('/blog', (req, res) => {
  const blogPath = path.join(__dirname, '..', 'dist', 'blog.html');
  res.sendFile(blogPath);
});
app.get('/blogs/edit/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    res.render('edit', { blog });
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred');
  }
});

app.put('/blogs/:id', async (req, res) => {
  try {
    await Blog.findByIdAndUpdate(req.params.id, req.body);
    res.redirect(`/blogs/${req.params.id}`);
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while updating the blog');
  }
});

app.delete('/blogs/:id', async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.redirect('/blogs');
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while deleting the blog');
  }
});

app.post('/submit', (req, res) => {
  const blog = new Blog({
    title: req.body.title,
    date: req.body.date,
    category: req.body.category,
    body: req.body.body,
    tags: req.body.tags.split(',').map(tag => tag.trim()),
    image: req.body.image,
  });

  blog.save()
  .then(() => {
    console.log('Blog saved successfully');
    res.redirect('/admin');
  })
  .catch(err => {
    console.error('An error occurred:', err);
  });
});

app.get('/pets', async (req, res) => {
  try {
    const organizationId = 'HI43';
    const pets = await petFinder.getPetsByOrganization(organizationId);
    res.json(pets);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.get('/login', (req, res) => {
  const loginPath = path.join(__dirname, '..', 'dist', 'login.html');
  res.sendFile(loginPath);
});

app.post('/login', (req, res) => {
  if (req.body.username === 'admin' && req.body.password === 'password') {
    req.session.isLoggedIn = true;
    res.redirect('/dashboard');
  } else {
    res.send('Invalid login credentials');
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});



