const mongoose = require('mongoose')

const languageSchema = new mongoose.Schema({
  language: {
    type: String,
    required: true,
  },
  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  }
})

languageSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id,
      delete returnedObject._v
  }
})

const Language = mongoose.model('Language', languageSchema)

module.exports = Language