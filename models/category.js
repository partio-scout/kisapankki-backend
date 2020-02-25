const mongoose = require('mongoose')
const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        required: true
    },
    task: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task'
      }]
    
})

categorySchema.set('toJSON', {
    transform: (document, retObj) => {
        retObj.id =  retObj._id.toString()
        delete retObj._id
        delete retObj.__v
    }
})

module.exports = mongoose.model('Category', categorySchema)