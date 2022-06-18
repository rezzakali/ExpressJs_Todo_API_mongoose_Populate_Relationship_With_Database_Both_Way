const mongoose = require('mongoose');

// Define the schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  todos: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'Todo',
    },
  ],
});

// creting the model using the todoSchema
const User = mongoose.model('User', userSchema);

module.exports = User;
