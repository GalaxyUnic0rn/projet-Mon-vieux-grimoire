// const http = require('http');
const express = require('express');
// const cors = require('cors');
require('./db.js');
const app = express();
const authRoute = require('./routes/authRoute.js');
const bookRoute = require('./routes/bookRoute.js');


// const homeController = require('./controllers/homeController');
// const userController = require('./controllers/userController');

// app.use(cors());
// CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(express.json())
app.use('/images', express.static('images'))
app.use('/api/auth', authRoute)
app.use('/api/books', bookRoute);

// app.get('/', homeController.homePage);
// app.post('/users', userController.createUser);

module.exports = app;