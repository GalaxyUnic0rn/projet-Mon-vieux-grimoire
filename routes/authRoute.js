const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const multerConfig = require('../middleware/multer-config');
const userController = require('../controllers/userController');

router.post('/signup', userController.createUser)
router.post('/login', userController.login)
router.post('/books', multerConfig, bookController.addBook);

module.exports = router