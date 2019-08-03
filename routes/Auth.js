const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const keys = require('../config/keys');

const router = express.Router();

//Register route
router.post('/register', (req, res) => {
    User.findOne({email: req.body.email.toLocaleLowerCase()})
        .then(user => {
            if(user) {
                res.status(400).json({"message": "Email already exist"})
                
            } else {

                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email.toLowerCase(),
                    password: req.body.password,
                    gender: req.body.gender
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

/**
 * Post route for login.
 * 
 * @name POST: /auth/login/
 * 
 * @param {string} email - email of the user
 * @param {string} password - password of user
 */
router.post('/login', (req, res) => {
    User.findOne({email: req.body.email})
     .then(user=>{
         if(!user) {
             return res.status(400).json({"message": "Email doesn't exist"});
         } else {
             bcrypt.compare(req.body.password, user.password)
                 .then(isMatch => {
                     
                     if (isMatch) {
                         const payload = {id: user.id, name: user.name, email: user.email};
 
                         // Sign Token
                         jwt.sign(
                             payload,
                             keys.secret,
                             (err, token) => {
                                 res.json({
                                     success: true,
                                     token: token,
                                     name: user.name
                                 });
                             }
                         );
                     } else {
                         return res.status(400).json({"message": "Password is invalid"})
                     }
                 })
         }
     })
 });

module.exports = router;