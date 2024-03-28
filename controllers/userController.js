const bcrypt = require('bcrypt');
const userModel = require('../models/user');
const jwt = require('jsonwebtoken')


const createUser = (req, res) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new userModel({
                email: req.body.email,
                password: hash
            });

            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                .catch(error => res.status(400).json({ error }))
        })
        .catch(error => res.status(500).json({ error }))
};

const login = (req, res) => {
    userModel.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé !' })
            }

            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect !' })
                    }

                    const token = jwt.sign({ userId: user._id }, 'RANDOM_TOKEN_SECRET', { expiresIn: '24h' })
                    return res.status(200).json({ userId: user._id, token })
                })
                .catch(error => res.status(500).json({ error }))

        })
        .catch(error => res.status(500).json({ error }))
}


module.exports = {
    createUser,
    login
}