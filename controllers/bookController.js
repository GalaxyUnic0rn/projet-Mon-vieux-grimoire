const Book = require('../models/book');

const getBooks = (req, res) => {
    Book.find()
        .then(data => res.status(200).json(data))
        .catch(error => res.status(400).json({ error }))
}

const createBook = (req, res) => {
    const bookObject = JSON.parse(req.body.book);
    bookObject.averageRating = bookObject.averageRating === null ? 0 : bookObject.averageRating

    console.log(req.file.filename)

    const book = new Book({
        ...bookObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });

    book.save()
        .then(() => res.status(201).json({ message: 'Objet livre enregistré !' }))
        .catch(error => res.status(400).json({ error }));
}

const getBestRatedBooks = (req, res) => {
    Book.find().sort({ averageRating: -1 }).limit(3)
        .then(books => res.status(200).json(books))
        .catch(error => res.status(400).json({ error }));
}
const getBookById = (req, res) => {
    const { id } = req.params;

    Book.findById(id)
        .then(book => {
            if (!book) {
                return res.status(404).json({ error: "Book not found" });
            }
            res.status(200).json(book);
        })
        .catch(error => res.status(400).json({ error }));
};

const updateBook = (req, res) => {
    const { id } = req.params;
    const { title, author, year, genre, rating } = req.body;
    const bookToUpdate = {};

    if (title) bookToUpdate.title = title;
    if (author) bookToUpdate.author = author;
    if (year) bookToUpdate.year = year;
    if (genre) bookToUpdate.genre = genre;
    if (rating !== undefined && rating !== null) bookToUpdate.rating = rating;
    if (req.file) {
        bookToUpdate.imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
    }

    const userIdFromToken = req.auth.userId;

    Book.findById(id)
        .then(book => {
            if (!book) {
                return res.status(404).json({ error: "Book not found" });
            }
            if (book.userId !== userIdFromToken) {
                return res.status(403).json({ error: "Unauthorized request" });
            }
            return Book.findByIdAndUpdate(id, bookToUpdate, { new: true });
        })
        .then(updatedBook => {
            if (!updatedBook) {
                return res.status(404).json({ error: "Book not found" });
            }
            res.status(200).json(updatedBook);
        })
        .catch(error => res.status(400).json({ error }));
};
const deleteBook = (req, res) => {
    const { id } = req.params;
    const userIdFromToken = req.auth.userId;

    Book.findById(id)
        .then(book => {
            if (!book) {
                return res.status(404).json({ error: "Book not found" });
            }
            if (book.userId !== userIdFromToken) {
                return res.status(403).json({ error: "Unauthorized request" });
            }
            return Book.findByIdAndDelete(id);
        })
        .then(deletedBook => {
            if (!deletedBook) {
                return res.status(404).json({ error: "Book not found" });
            }
            res.status(200).json({ message: "Book deleted successfully" });
        })
        .catch(error => res.status(400).json({ error }));
};

module.exports = {
    getBooks,
    createBook,
    getBestRatedBooks,
    getBookById,
    updateBook,
    deleteBook
}
