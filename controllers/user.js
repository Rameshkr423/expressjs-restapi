const multer = require('multer');
const bcrypt = require('bcrypt');
const { User } = require('../models/user'); // Import the User model
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Preserve file extension
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only JPEG, JPG, and PNG files are allowed"), false);
    }
};

const uploadImg = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: fileFilter 
}).single('image');


// GET all User
const getAllUser = async (req, res) => {
    try {
        const users = await User.find({}).select('email name password');
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};





// POST new user
const newUser = async (req, res) => {
    try {
        console.log(req.file); // Optional: log uploaded file

        const existingUser = await User.findOne({ name: req.body.name });

        if (existingUser) {
            return res.json({ message: "User already exists" });
        }

        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        });

        const savedUser = await newUser.save();
        res.json(savedUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// POST new tea
const newTea = async (req, res) => {
    try {

        console.log(req.file); // Add this line to check file details

    

        const existingTea = await Tea.findOne({ name: req.body.name });

        if (existingTea) {
            return res.json({ message: "Tea already exists" });
        }

        const newTea = new Tea({
            name: req.body.name,
            image: req.file ? `/uploads/${req.file.path}` : null,
            description: req.body.description,
            keywords: req.body.keywords,
            origin: req.body.origin,
            brew_time: req.body.brew_time,
            temperature: req.body.temperature,
        });

        const savedTea = await newTea.save();
        res.json(savedTea);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// DELETE all tea
//DELETE teas
const deleteAllUser = (req, res) => {
    User.deleteMany({})
        .then(() => res.json({ message: "Complete delete successful" }))
        .catch(err => res.status(500).json({ message: "Complete delete failed", error: err.message }));
};

// GET single user
const getOneUser = async (req, res) => {
    try {
        const name = req.params.name; // Get the User name
        const User = await User.findOne({ name: name });

        if (!User) {
            return res.status(404).json({ message: "User doesn't exist." });
        }

        return res.json(tea);
    } catch (err) {
        return res.status(500).json({ message: "Error fetching user.", error: err.message });
    }
};

//POST 1 User comment
const newComment = async (req, res) => {
    try {
        const name = req.params.name; // Get the User to add the comment
        const newComment = req.body.comment; // Get the comment

        if (!newComment) {
            return res.status(400).json({ message: "Comment cannot be empty." });
        }

        // Find the user object
        const user = await User.findOne({ name: name });

        if (!user) {
            return res.status(404).json({ message: "User doesn't exist." });
        }

        // Create a comment object to push
        const comment = {
            text: newComment,
            date: new Date()
        };

        // Add comment to comments array
        User.comments.push(comment);

        // Save changes to DB
        await User.save();

        return res.json({ message: "Comment added successfully.", User });

    } catch (err) {
        return res.status(500).json({ message: "Error adding comment.", error: err.message });
    }
};

// DELETE one user
//DELETE 1 user
const deleteOneUser = async (req, res) => {
    try {
        const name = req.params.name; // Get the user name

        // Delete the user document
        const result = await User.deleteOne({ name: name });

        // Check if the user existed and was deleted
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "user doesn't exist." });
        }

        return res.json({ message: "User deleted successfully." });

    } catch (err) {
        return res.status(500).json({ message: "Something went wrong, please try again.", error: err.message });
    }
};


// Export all functions
module.exports = {
    getAllUser,
    uploadImg,
    newTea,
    deleteAllUser,
    getOneUser,
    newComment,
    deleteOneUser,
    newUser
};
