const mongoose = require('mongoose')
const ageGroupSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        required: true
    },
    maxAge: {
        type: Number,
        required: true
    },
    minAge: {
        type: Number,
        required: true
    },
    color: {
        type: String,
        minlength: 3,
        required: true
    },
    task: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task'
    }
})

ageGroupSchema.set('toJSON', {
    transform: (document, retObj) => {
        retObj.id =  retObj._id.toString()
        delete retObj._id
        delete retObj.__v
    }
})

module.exports = mongoose.model('AgeGroup', ageGroupSchema)