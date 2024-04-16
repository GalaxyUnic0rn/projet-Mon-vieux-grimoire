const fs = require('fs')
const average = require('../utils/average');
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

const updateBookById = (req, res) => {
    const bookObject = req.file ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };

    console.log('imageUrl:', bookObject.imageUrl)

    Book.findOne({ _id: req.params.id })
        .then(book => {
            if (!book) {
                return res.status(404).json({ error: new Error("Book not found") });
            }
            if (book.userId !== req.auth.userId) {
                return res.status(403).json({ error: new Error("Unauthorized request") });
            }
            if (typeof bookObject.imageUrl === 'undefined') {
                bookObject.imageUrl = book.imageUrl
            }

            if (bookObject.imageUrl !== book.imageUrl) {
                const filename = book.imageUrl.split('/images/')[1]
                fs.unlink(`./images/${filename}`, (err, info) => console.log(err || info))
            }

            return Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id })
        })
        .then(() => res.status(200).json({ message: 'book updated !' }))
        .catch(error => res.status(400).json({ error }));
};


const deleteBookById = (req, res) => {
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

            const filename = book.imageUrl.split('/images/')[1]
            fs.unlink(`./images/${filename}`, (err, info) => {
                console.log(err || info)
                Book.findByIdAndDelete(id)
                    .then(() => res.status(200).json({ message: "Book deleted successfully" }))
                    .catch(error => res.status(400).json({ error }));
            })
        })
        .catch(error => res.status(400).json({ error }));
};



const createRating = (req, res, next) => {
    if (0 <= req.body.rating <= 5) {
        const ratingObject = { ...req.body, grade: req.body.rating };
        delete ratingObject._id;
        Book.findOne({_id: req.params.id})
            .then(book => {
                const newRatings = book.ratings;
                const userIdArray = newRatings.map(rating => rating.userId);
                if (userIdArray.includes(req.auth.userId)) {
                    res.status(403).json({ message : 'Not authorized' });
                } else {
                    newRatings.push(ratingObject);
                    const grades = newRatings.map(rating => rating.grade);
                    const averageGrades = average.average(grades);
                    book.averageRating = averageGrades;
                    Book.updateOne({ _id: req.params.id }, { ratings: newRatings, averageRating: averageGrades, _id: req.params.id })
                        .then(() => { res.status(201).json()})
                        .catch(error => { res.status(400).json( { error })});
                    res.status(200).json(book);
                }
            })
            .catch((error) => {
                res.status(404).json({ error });
            });
    } else {
        res.status(400).json({ message: 'The rating must be between 1 and 5.' });
    }
};


const getBestRating = (req, res, next) => {
    Book.find().sort({averageRating: -1}).limit(3)
        .then((books)=>res.status(200).json(books))
        .catch((error)=>res.status(404).json({ error }));
};
module.exports = {
    getBooks,
    createBook,
    getBookById,
    updateBookById,
    deleteBookById,
    createRating,
    getBestRating
}
