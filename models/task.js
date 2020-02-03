const mongoose = require('mongoose')
const taskSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 1,
        required: true
    },
    assignmentText: {
        type: String,
        minlength: 1,
        required: true
    },
    supervisorInstructions: {
        type: String,
        required: false
    },
    gradingScale: {
        type: String,
        required: false
    },
    creatorName: {
        type: String,
        minlength: 1,
        required: true
    },
    creatorEmail: {
        type: String,
        minlength: 1,
        required: true
    },
    pending: {
        type: Boolean,
        required: true
    },
    ageGroup: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AgeGroup'
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    language: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Language'
    },
    rules: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Rule'
    }
    // media: ???           // pointer/url/entity ??
})

taskSchema.set('toJSON', {
    transform: (document, retObj) => {
        retObj.id =  retObj._id.toString()
        delete retObj._id
        delete retObj.__v
    }
})

module.exports = mongoose.model('Task', taskSchema)