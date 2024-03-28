const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const multerConfig = require('../middleware/multer-config');

router.post('/', multerConfig, bookController.addBook);

module.exports = router;
