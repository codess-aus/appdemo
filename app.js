// Import the express module, which is a web application framework for Node.js
const express = require('express');

// Import the mongoose module, which is an Object Data Modeling (ODM) library for MongoDB and Node.js
const mongoose = require('mongoose');

// Connect to MongoDB database at the specified URL, with options for the connection
mongoose.connect('mongodb://localhost/mydatabase', { useNewUrlParser: true, useUnifiedTopology: true });

// Define a schema for the User data. This schema represents the structure of the data in MongoDB
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    age: Number
});

// Create a model based on the userSchema. This model is a constructor compiled from the Schema definitions.
const User = mongoose.model('User', userSchema);

// Create an instance of an Express application
const app = express();

// Use the express.json() middleware function, which parses incoming requests with JSON payloads
app.use(express.json());

// Define a GET route for '/api/users'. This route will respond with a list of all users
app.get('/api/users', (req, res) => {
    User.find().then(users => res.send(users));
});

// Define a POST route for '/api/users'. This route will create a new user with the data in the request body
app.post('/api/users', (req, res) => {
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        age: req.body.age
    });

    user.save().then(savedUser => res.send(savedUser));
});

// Start the server, listening on the default port 3000
app.listen(process.env.PORT || 3000, () => console.log(`Server listening on port ${process.env.PORT || 3000}`));