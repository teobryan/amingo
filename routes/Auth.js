const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const keys = require('../config/keys');

const router = express.Router();

//Register route
router.post('/register', (req, res) => {
    User.findOne({email: req.body.email})
        .then(user => {
            if(user) {
                res.status(400).json({"message": "Email alerady exist"})
            } else {
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password
                });

                bcrypt.genSalt((err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser
                            .save()
                            .then(user => res.json(user))
                            .catch(err => console.log(err));
                    });
                });
            }
        })
});

//Login route
router.post('/login', (req, res) => {
    
})

module.exports = router;