const mongoose = require('mongoose')

const QAschema = mongoose.Schema({
    question:String,
    answer:String,
    options:{
        type:[String],
    }
})

const skillTestSchema = mongoose.Schema({
    skill:String,
    test:[QAschema]
})

const skillTestModel = mongoose.model('skillquestion',skillTestSchema,)

module.exports = skillTestModel