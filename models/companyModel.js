const mongoose = require("mongoose")

const mainSchema= mongoose.Schema({
    shortdescription:{type:String,default:""},
    profile:{type:String,default:""},
    coverphoto:{type:String,default:""},
    social_media:{
        website:{type:String,default:""},
    }})
const companySchema = mongoose.Schema({
    company:String,
    email:String,
    password:String,
    mains:{
        type:mainSchema,
        default:{}
    },
    aboutus:{
        type:String,
        default:""
    }
},{minimize:false})

const companyModel = mongoose.model("company",companySchema,"companies")
module.exports = companyModel