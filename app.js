// db.js
const mongoose = require('mongoose');

const connectDB = (url) => mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

module.exports = connectDB;

// user.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    age: Number
});

const User = mongoose.model('User', userSchema);

module.exports = User;

// routes.js
const express = require('express');
const router = express.Router();

const routes = (User) => {
    router.get('/api/users', async (req, res) => {
        const users = await User.find();
        res.send(users);
    });

    router.post('/api/users', async (req, res) => {
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            age: req.body.age
        });
        await user.save();
        res.send(user);
    });

    return router;
};

module.exports = routes;

// server.js
const express = require('express');
const connectDB = require('./db');
const User = require('./user');
const routes = require('./routes');

const app = express();
app.use(express.json());

const startServer = async (port, dbUrl) => {
    try {
        await connectDB(dbUrl);
        console.log('Connected to MongoDB');
        app.use(routes(User));
        app.listen(port, () => console.log(`Server listening on port ${port}`));
    } catch (err) {
        console.error('Failed to connect to MongoDB', err);
    }
};

const port = process.env.PORT || 3000;
const dbUrl = 'mongodb://localhost/mydatabase';

startServer(port, dbUrl);