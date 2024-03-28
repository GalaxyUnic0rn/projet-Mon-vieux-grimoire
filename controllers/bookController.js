const Book = require('../models/book');
const jwt = require('jsonwebtoken'); 

exports.addBook = async (req, res) => {
    try {
        console.log(req.body);
        const { title, author, imageUrl, year, genre } = req.body;
        const token = req.headers.authorization.split(' ')[1]; 
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        const userId = decodedToken.userId; 
        
        const newBook = new Book({
            userId,
            title,
            author,
            imageUrl,
            year,
            genre
        });
        await newBook.save();
        res.status(201).json({ message: 'Book added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to add book' });
    }
};

