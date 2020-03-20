const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true,
  },
  username: {
    type: String,
    minlength: 3,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    minlength: 5,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    delete returnedObject._id
    delete returnedObject._v
    delete returnedObject.password
  },
})

userSchema.plugin(uniqueValidator)

const User = mongoose.model('User', userSchema)


module.exports = User
