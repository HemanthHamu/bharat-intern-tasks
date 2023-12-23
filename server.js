const express = require('express');
const mongoose = require('mongoose');
//bodyParser for passing the incoming request body to req.body property
const bodyParser = require('body-parser');
const path = require('path')
const app = express();
const port = 3086;

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
app.use(express.static(__dirname));

// Handling http methods
//this is the file that is going to be displayed when server starts
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'registerform.html'));
});

// post method for passing the data from html form to mongoDB 
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    // Create a new user
    // here newUser variable is an object created using User class
    const newUser = new User({
      username,
      email,
      password
    });
    // this is the method to save the user details into the database
    await newUser.save();
    // Respond with a success message
    //this is the file that is going to be displayed after user enters their credentials and click on signup button
    res.sendFile(path.join(__dirname, 'success.html'));
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


