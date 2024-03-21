// userController.js

const User = require('../models/user');

// Fonction pour créer un nouvel utilisateur
exports.createUser = (req, res) => {
    const newUser = new User({
        email: req.body.email,
        password: req.body.password
    });

    newUser.save()
        .then(user => {
            res.status(201).json(user);
        })
        .catch(err => {
            res.status(400).json({ error: err.message });
        });
};
