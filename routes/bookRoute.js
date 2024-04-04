const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const auth = require('../middleware/securityMiddleware')
const multerConfig = require('../middleware/multer-config');
const sharp = require('../middleware/sharpConfig')


router.get('/bestrating', auth, bookController.getBestRatedBooks);
router.get('/', bookController.getBooks);
router.post('/', auth, multerConfig, sharp, bookController.createBook);
router.get('/:id', bookController.getBookById);
router.put('/:id', auth, bookController.updateBook);
router.delete('/:id', auth, bookController.deleteBook);


module.exports = router;
