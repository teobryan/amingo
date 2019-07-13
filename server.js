var bodyParser = require('body-parser')
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const User = require('./models/User'); //import the file we created
const Post = require('./models/Post'); //import the file we created

const db = "mongodb+srv://bryan:11!Khema@cluster0-wyric.mongodb.net/test?retryWrites=true&w=majority"

app.use(bodyParser.urlencoded({ extended: false}));

mongoose.connect(db, {})
.then(() => console.log("Db Connected"))
.catch(err => console.log(err));

// Body parser middleware
app.use(express.urlencoded());

/* GET home page. */
app.get('/', (req, res) => res.json({
	msg: "Hello! Amigo!"
}));

app.post('/users', (req, res) => {
	const newUser = new User({
	    name: req.body.name,
	    email: req.body.email,
	    password: req.body.password
	});

	newUser
	    .save()
	    .then(user => res.json(user))
	    .catch(err => res.json(err));
});

app.get('/users', (req, res) => {
    User.find()
    .then(users => res.json(users))
    .catch(err => console.log(err))
})

app.post('/posts', (req, res) => {
	User.findOne({email: req.body.email}).then( user =>{
		console.log("User found", user);
		if (user) {
			const newPost = new Post({
				message: req.body.message,
				user: user
			})

			newPost
				.save()
				.then(post => res.json (post))
				.catch(err => res.json(err))
		} else {
			return res.status(400).json({message: "User not found"})
		}
	})
});

// app.get('/posts', (req,res) => {
	
// });


//Fetch posts by email
app.post('/users/posts', (req,res) => {
	User.findOne({email: req.body.email})
	.then( user => {

	Post.find({email: req.body.email})
		.then(posts => res.json(posts))
		.catch(err => console.log(err))
	})
	.catch(err => res.json(err))
});

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running at http://localhost:${port}`));