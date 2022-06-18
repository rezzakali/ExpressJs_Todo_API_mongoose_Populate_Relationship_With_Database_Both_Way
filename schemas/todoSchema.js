const mongoose = require('mongoose');

// Define the schema
const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
  },
  Date: {
    type: Date,
    default: new Date(),
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
  },
});

// instance method
todoSchema.methods = {
  findActive() {
    return mongoose.model('Todo').find({ status: 'active' });
  },
  findByLanguage() {
    return mongoose.model('Todo').find({ title: 'PHP' });
  },
};

// static methods
todoSchema.statics = {
  findByJS() {
    return this.find({ title: /js/i });
  },
};

// query helpers
todoSchema.query = {
  byLanguage(language) {
    return this.find({ title: new RegExp(language, 'i') });
  },
};

// creting the model using the todoSchema
const Todo = mongoose.model('Todo', todoSchema);

// exports the todo model
module.exports = Todo;
