const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
      type: String,
      unique: true,
      required: true,
    },
    password: String,
    // Other user-related fields can be added here
  });
  
  const User = mongoose.model('User', userSchema);
  
  module.exports = User;
  