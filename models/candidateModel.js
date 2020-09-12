const mongoose = require('mongoose')

const mainSchema = mongoose.Schema({
    shortdescription:{type:String,default:""},
    profile:{type:String,default:""},
    coverphoto:{type:String,default:""},
    social_media:{
        github:{type:String,default:""},
        twitter:{type:String,default:""},
        instagram:{type:String,default:""}
    }})

const worksSchema = mongoose.Schema({
    company:String,
    timeline:{start:{month:String,year:Number},end:{month:String,year:Number}},
    role:String,
    logo:{
        type:String,
        default:false
    },
    description:String
})


const educationsSchema = mongoose.Schema({
    institute:String,
    timeline:{start:{month:String,year:Number},end:{month:String,year:Number}},
    course:String,
    logo:{
        type:String,
        default:false
    }
})

const projectsSchema = mongoose.Schema({
    title:String,
    timeline:{month:String,year:Number},
    description:String,
    tools:[String],
    link:String
})

const skillsSchema = mongoose.Schema({
    name:String,
    verified:{
        type:Boolean,
        default:false
    },
    LastAttended:{
        type:Number,
        defult:0
    }
})

const candidateSchema = mongoose.Schema({
    name:String,
    email:String,
    password:String,
    mains:{type:mainSchema,default:{}},
    skills:[skillsSchema],
    works:{data:[worksSchema],display:{type:Boolean,default:true}},
    educations:{data:[educationsSchema],display:{type:Boolean,default:true}},
    projects:{data:[projectsSchema],display:{type:Boolean,default:true}},
    interests:[String]
},{minimize:false})

const candidateModel = mongoose.model("candidate",candidateSchema)

module.exports = {
    candidateModel,
    mainSchema
}