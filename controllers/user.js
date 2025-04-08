const multer = require('multer');
const { User } = require('../models/user'); // Import the Tea model
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
        const users = await User.find({});
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};




// POST new user
const newUser = async (req, res) => {
    try {

        console.log(req.file); // Add this line to check file details
        const existingTea = await User.findOne({ name: req.body.name });

        if (existingTea) {
            return res.json({ message: "User already exists" });
        }

        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
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
const deleteAllTea = (req, res) => {
    Tea.deleteMany({})
        .then(() => res.json({ message: "Complete delete successful" }))
        .catch(err => res.status(500).json({ message: "Complete delete failed", error: err.message }));
};

// GET single tea
const getOneTea = async (req, res) => {
    try {
        const name = req.params.name; // Get the tea name
        const tea = await Tea.findOne({ name: name });

        if (!tea) {
            return res.status(404).json({ message: "Tea doesn't exist." });
        }

        return res.json(tea);
    } catch (err) {
        return res.status(500).json({ message: "Error fetching tea.", error: err.message });
    }
};

//POST 1 tea comment
const newComment = async (req, res) => {
    try {
        const name = req.params.name; // Get the tea to add the comment
        const newComment = req.body.comment; // Get the comment

        if (!newComment) {
            return res.status(400).json({ message: "Comment cannot be empty." });
        }

        // Find the tea object
        const tea = await Tea.findOne({ name: name });

        if (!tea) {
            return res.status(404).json({ message: "Tea doesn't exist." });
        }

        // Create a comment object to push
        const comment = {
            text: newComment,
            date: new Date()
        };

        // Add comment to comments array
        tea.comments.push(comment);

        // Save changes to DB
        await tea.save();

        return res.json({ message: "Comment added successfully.", tea });

    } catch (err) {
        return res.status(500).json({ message: "Error adding comment.", error: err.message });
    }
};

// DELETE one tea
//DELETE 1 tea
const deleteOneTea = async (req, res) => {
    try {
        const name = req.params.name; // Get the tea name

        // Delete the tea document
        const result = await Tea.deleteOne({ name: name });

        // Check if the tea existed and was deleted
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Tea doesn't exist." });
        }

        return res.json({ message: "Tea deleted successfully." });

    } catch (err) {
        return res.status(500).json({ message: "Something went wrong, please try again.", error: err.message });
    }
};


// Export all functions
module.exports = {
    getAllTea,
    uploadImg,
    newTea,
    deleteAllTea,
    getOneTea,
    newComment,
    deleteOneTea,
    newUser
};
