// Import the express module, which is a web application framework for Node.js
const express = require('express');

// Import the mongoose module, which is an Object Data Modeling (ODM) library for MongoDB and Node.js
const mongoose = require('mongoose');

class Database {
    constructor(url) {
        this.url = url;
    }

    connect() {
        return mongoose.connect(this.url, { useNewUrlParser: true, useUnifiedTopology: true });
    }
}

class User {
    constructor() {
        this.userSchema = new mongoose.Schema({
            name: String,
            email: String,
            age: Number
        });

        this.UserModel = mongoose.model('User', this.userSchema);
    }

    async find() {
        return this.UserModel.find();
    }

    async create(data) {
        const user = new this.UserModel(data);
        return user.save();
    }
}

class Routes {
    constructor(app, user) {
        this.app = app;
        this.user = user;
    }

    setupRoutes() {
        this.app.get('/api/users', async (req, res) => {
            const users = await this.user.find();
            res.send(users);
        });

        this.app.post('/api/users', async (req, res) => {
            const user = await this.user.create({
                name: req.body.name,
                email: req.body.email,
                age: req.body.age
            });
            res.send(user);
        });
    }
}

class Server {
    constructor(port, dbUrl) {
        this.port = port;
        this.dbUrl = dbUrl;
        this.app = express();
        this.app.use(express.json());
        this.database = new Database(this.dbUrl);
        this.user = new User();
        this.routes = new Routes(this.app, this.user);
    }

    async start() {
        try {
            await this.database.connect();
            console.log('Connected to MongoDB');
            this.routes.setupRoutes();
            this.app.listen(this.port, () => console.log(`Server listening on port ${port}`));
        } catch (err) {
            console.error('Failed to connect to MongoDB', err);
        }
    }
}

const port = process.env.PORT || 3000;
const dbUrl = 'mongodb://localhost/mydatabase';

const server = new Server(port, dbUrl);
server.start();