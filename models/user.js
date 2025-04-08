const mongoose = require('mongoose');

// User Schema
const UserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String
}, { collection: 'users' });


const User = mongoose.model('User', UserSchema);

module.exports = { User };
