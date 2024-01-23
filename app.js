// Import the express module, which is a web application framework for Node.js
const express = require('express');

// Import the mongoose module, which is an Object Data Modeling (ODM) library for MongoDB and Node.js
const mongoose = require('mongoose');

// Configuration object
const config = {
    dbUrl: 'mongodb://localhost/mydatabase',
    options: { useNewUrlParser: true, useUnifiedTopology: true },
    port: process.env.PORT || 3000
};

// Function to connect to the database
const connectToDatabase = (url, options) => mongoose.connect(url, options)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB', err));

// Function to create the User model
const createUserModel = (schema) => mongoose.model('User', new mongoose.Schema(schema));

// Function to create the routes
const createRoutes = (app, User) => {
    app.get('/api/users', async (req, res) => {
        const users = await User.find();
        res.send(users);
    });

    app.post('/api/users', async (req, res) => {
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            age: req.body.age
        });
        await user.save();
        res.send(user);
    });
};

// Function to start the server
const startServer = (app, port) => app.listen(port, () => console.log(`Server listening on port ${port}`));

// Create an instance of an Express application
const app = express();

// Use the express.json() middleware function, which parses incoming requests with JSON payloads
app.use(express.json());

// Connect to the database
connectToDatabase(config.dbUrl, config.options);

// Create the User model
const User = createUserModel({
    name: String,
    email: String,
    age: Number
});

// Create the routes
createRoutes(app, User);

// Start the server
startServer(app, config.port);