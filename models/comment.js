const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  nickName: {
    type: String,
    required: false,
  },
  created: {
    type: Date,
    default: Date.now,
  },
  pending: {
    type: Boolean,
    required: true,
  },
  task: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
  }],
})

commentSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id,
    delete returnedObject._v
  },
})

module.exports = mongoose.model('Comment', commentSchema)
