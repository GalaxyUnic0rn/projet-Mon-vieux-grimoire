const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const auth = require('../middleware/securityMiddleware')
const multerConfig = require('../middleware/multer-config');
const sharp = require('../middleware/sharpConfig')


router.get('/bestrating', bookController.getBestRating);
router.get('/', bookController.getBooks);
router.post('/', auth, multerConfig, sharp, bookController.createBook);
router.get('/:id', bookController.getBookById);
router.put('/:id', auth, multerConfig, sharp, bookController.updateBookById);
router.delete('/:id', auth, bookController.deleteBookById);
router.post('/:id/rating', auth, bookController.createRating);



module.exports = router;
