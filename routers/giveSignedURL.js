const Router = require('express').Router()
const companyModel = require('../models/companyModel')
const candidateModel = require('../models/candidateModel').candidateModel
const aws = require('aws-sdk')
require('dotenv').config()

const auth = async(req,res,next)=>{
    try{
        const {_id} = req.body
        const company =  await companyModel.findById(_id) 
        const candidate = await candidateModel.findById(_id)
        if(company||candidate) next()
        else res.end({"error":"Auth failed"})
    }
    catch(err){
        res.send(err)
    }

}
Router.post('/URL',auth,(req,res)=>{
        const s3 = new aws.S3({
            accessKeyId:process.env.accessKeyId,
            secretAccessKey:process.env.secretAccessKey,
            region:process.env.region
        })
        s3.getSignedUrl("putObject",{
            Bucket:"connectus-bucket",
            ContentType:req.body.type,
            Key:req.body.name
        },(err,url)=>{
            if(err) res.send({err})
            res.send({url})
        })
})

module.exports =  Router