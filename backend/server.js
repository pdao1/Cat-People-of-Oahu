const express = require('express');
const app = express();
const router = express.Router();
const path = require('path');
const mongoose = require('mongoose');
// const QueueModel = require('./models/QueueModel');
const session = require('express-session');
// const User = require('./models/User');
const petFinder = require('./petFinder')
const Blog = require('./models/blogSchema')
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

// app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }))
app.use(express.json());


// Serve static files from the 'dist' folder
app.use(express.static(path.join(__dirname, '..', 'dist')));

// Serve the 'admin.html' file from the 'public' folder
app.get('/', (req, res) => {
  const indexPath = path.join(__dirname, '..', 'dist', 'index.html');
  res.sendFile(indexPath);
});

app.get('/admin', (req, res) => {
  const adminHtmlPath = path.join(__dirname, '..', 'dist', 'admin.html');
  res.sendFile(adminHtmlPath);
});

// Backend code
app.get('/api/blogs', async (req, res) => {
  try {
    const blogs = await Blog.find({});
    res.json(blogs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
});


app.use(bodyParser.urlencoded({ extended: true }));

app.post('/submit', (req, res) => {
  const blog = new Blog({
    title: req.body.title,
    date: req.body.date,
    category: req.body.category,
    body: req.body.body,
    tags: req.body.tags.split(',').map(tag => tag.trim()), // Splitting the tags by comma
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

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));

// Middleware to check if user is logged in
const isLoggedIn = (req, res, next) => {
  if (req.session.isLoggedIn) {
    next();
  } else {
    res.redirect('/login');
  }
};

// app.get('/', (req, res) => {
//   res.send('<h1>Welcome to the Blog</h1>');
// });

// app.get('/admin', isLoggedIn, (req, res) => {
//   res.send('<h1>Admin Page</h1><a href="/logout">Logout</a>');
// });

// app.get('/login', (req, res) => {
//   // res.send(`
//   //   <h1>Login</h1>
//   //   <form method="post" action="/login">
//   //     <input type="text" name="username" placeholder="Username" required><br>
//   //     <input type="password" name="password" placeholder="Password" required><br>
//   //     <button type="submit">Login</button>
//   //   </form>
//   // `);
// });

app.get('/login', (req, res) => {
  const loginPath = path.join(__dirname, '..', 'dist', 'login.html');
  res.sendFile(loginPath);
});

app.post('/login', (req, res) => {
  // Simulate a simple login process
  if (req.body.username === 'admin' && req.body.password === 'password') {
    req.session.isLoggedIn = true;
    res.redirect('/admin');
  } else {
    res.send('Invalid login credentials');
  }
});

app.get('/logout', (req, res) => {
  req.session.isLoggedIn = false;
  res.redirect('/login');
});



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


// app.get('/logout', (req, res) => {
//   req.session.destroy((err) => {
//     if (err) {
//       console.error(err);
//     } else {
//       res.redirect('/locations/${req.params.id}/login');
//     }
//   });
// });

// REGULAR ROUTES END



// PORT LISTEN

