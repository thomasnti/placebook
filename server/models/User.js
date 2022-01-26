const mongoose = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  email:    { type: String, required: true, unique: true }, // unique only helps mongoose to find faster the document
  password: { type: String, required: true, minlength: 6 },
  image:    { type: String, required: true },
  places:   [{ type: mongoose.Types.ObjectId, required: true, ref: 'Place' }] // array of objects
});

// userSchema.plugin(uniqueValidator); // validates that email is unique in our DB -- IT CAUSES A BUG after all

module.exports = mongoose.model('User', userSchema);