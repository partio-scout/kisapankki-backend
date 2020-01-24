const mongoose = require('mongoose')
const taskSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        required: true
    },
    assignmentText: {
        type: String,
        minlength: 5,
        required: true
    },
    supervisorInstructions: {
        type: String,
        minlength: 5,
        required: true
    },
    gradingScale: {
        type: String,
        minlength: 5,
        required: true
    },
    creatorName: {
        type: String,
        minlength: 3,
        required: true
    },
    creatorEmail: {
        type: String,
        minlength: 5,
        required: true
    },
    // ageGroup: ???,       // foreignKey AgeGroup
    // category: ???,       // foreignKey Category
    language: {
        type: String,
        required: true
    },
    // rules: ???,          // foreignKey Rules
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