const mongoose = require('mongoose')

const ruleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  task: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
  }],
  acceptedCategories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }]
})

ruleSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id,
    delete returnedObject._v
  },
})

const Rule = mongoose.model('Rule', ruleSchema)

module.exports = Rule
