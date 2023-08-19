const express = require('express');
const app = express();
const router = express.Router();
const path = require('path');
const mongoose = require('mongoose');
// const QueueModel = require('./models/QueueModel');
const session = require('express-session');
// const User = require('./models/User');
const petFinder = require('./petFinder')

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
  const adminHtmlPath = path.join(__dirname, '..', 'dist', 'index.html');
  res.sendFile(adminHtmlPath);
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

app.get('/login', (req, res) => {
  res.send(`
    <h1>Login</h1>
    <form method="post" action="/login">
      <input type="text" name="username" placeholder="Username" required><br>
      <input type="password" name="password" placeholder="Password" required><br>
      <button type="submit">Login</button>
    </form>
  `);
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

