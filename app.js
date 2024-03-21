// const http = require('http');
const express = require('express');
require('./db.js')
const app = express()

module.exports = app

const homeController = require('./controllers/homeController');
const userController = require('./controllers/userController');

app.get('/', homeController.homePage);
app.post('/users', userController.createUser);

module.exports = app;