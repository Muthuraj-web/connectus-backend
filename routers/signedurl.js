const candidateModel = require("../models/candidateModel").candidateModel
const companyModel = require("../models/companyModel")
const aws = require('aws-sdk')
const { decode } = require("jsonwebtoken")
const { Error } = require("mongoose")
const Router = require("express").Router()

const auth=async(req,res,next)=>{
    try{
        const {_id} = decode(req.body.jwt)
        const candidate = await candidateModel.findOne({_id})
        const company = await companyModel.findOne({_id})
        if(candidate||company) next()
        else new Error("Invalid USER")
    }
    catch(err){
        res.send(err)
    }
}

Router.post('/',auth,async(req,res)=>{
    try{
        const s3 = new aws.S3({
            accessKeyId:process.env.accessKeyId,
            secretAccessKey:process.env.secretAccessKey,
            region:process.env.region
        })
        const url = await s3.getSignedUrl("putObject",{
            Bucket:"connectus-bucket",
            ContentType:req.body.type,
            Key:req.body.name,
        })
        res.send(url)
    }
    catch(err){
        res.send(err)
    }
})

module.exports = Router