const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 1,
    required: true,
  },
  assignmentText: {
    type: String,
    minlength: 1,
    required: true,
  },
  assignmentTextMD: {
    type: String,
    minlength: 1,
    required: true,
  },
  supervisorInstructions: {
    type: String,
    required: false,
  },
  supervisorInstructionsMD: {
    type: String,
    required: false,
  },
  gradingScale: {
    type: String,
    required: false,
  },
  gradingScaleMD: {
    type: String,
    required: false,
  },
  creatorName: {
    type: String,
    minlength: 1,
    required: true,
  },
  creatorEmail: {
    type: String,
    minlength: 1,
    required: true,
  },
  pending: {
    type: Boolean,
    required: true,
  },
  series: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Series',
  }],
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  },
  language: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Language',
  },
  rules: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Rule',
  },
  files: [{
    type: String,
  }],
  views: {
    type: Number,
    required: true
  },
  ratings: [{
    type: Number
  }],
  ratingsAVG: {
    type: Number
  }
})

taskSchema.set('toJSON', {
  transform: (document, retObj) => {
    retObj.id = retObj._id.toString()
    delete retObj._id
    delete retObj.__v
  },
})

module.exports = mongoose.model('Task', taskSchema)
