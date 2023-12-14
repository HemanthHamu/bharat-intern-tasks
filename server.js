const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const port = 3010;

// Connect MongoDB to our register form
mongoose.connect('mongodb://127.0.0.1:27017/registration_form')
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

app.use(bodyParser.urlencoded({ extended: true }));


// Create a user schema
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String
});

const User = mongoose.model('User', userSchema);

// Middleware for parsing JSON
app.use(bodyParser.json());
app.use(express.static('views'));

// Define routes
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/registerform.html');
});
// post method for passing the data into the database
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  console.log('Received Data : ',{username,email,password})
  try {
    // Create a new user
    const newUser = new User({
      username,
      email,
      password
    });
    // Save the user to the database
    await newUser.save();

    // Respond with a success message
    res.sendFile(__dirname + '/views/success.html');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error registering user');
  }
});
//get method for checking available users in the database
app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    console.log('Available Users',users);
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching user details');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

