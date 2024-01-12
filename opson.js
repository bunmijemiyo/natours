const validator = require('validator');

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: [true, 'A user must have a name'],
  },

  username: {
    type: String,
    required: [true, 'A user must have a name'],
  },

  email: {
    type: String,
    unique: true,
    required: [true, 'A user must have an email address'],
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },

  password: {
    type: String,
    required: [true, 'password required'],
    minlength: 8,
    select: false,
  },
  confirmPassword: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // This only works on CREATE and SAVE!!!
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same',
    },
  },
});

const foodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  category: String,
  price: { type: Number, required: true },
  imageUrl: String,
  // Add more fields as needed for your app
});

//   const Food = mongoose.model('Food', foodSchema);

const mongoose = require('mongoose');
// const Food = require('./food'); // Path to your food model file

// Connect to the MongoDB database
mongoose.connect('mongodb://localhost/foodappdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create a new food item
const newFood = new Food({
  name: 'Pizza Margherita',
  description: 'Classic Italian pizza with tomatoes and mozzarella cheese.',
  category: 'Pizza',
  price: 10.99,
  imageUrl: 'https://example.com/pizza.jpg',
});

// Save the food item to the database
newFood
  .save()
  .then(() => {
    console.log('Food item saved successfully');
  })
  .catch((error) => {
    console.error('Error saving food item:', error);
  });

//   module.exports = Food;
