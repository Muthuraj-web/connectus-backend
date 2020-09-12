const Router = require('express').Router()
const mongoose = require('mongoose')
const candidateModel = require('../models/candidateModel').candidateModel
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const auth = async(req,res,next)=>{
    try{
        const {_id} = jwt.decode(req.body.jwt)
        await candidateModel.findById(_id)
        next()
    }
    catch(err){
        res.sendStatus(401)
    }

}

Router.get("/:id",async(req,res)=>{
    try{
        const detail = await candidateModel.findOne({_id:req.params.id},{password:0})
        res.send(detail)
    }
    catch(err){
    }
})
Router.get("/mains/:id",async(req,res)=>{
    try{
        const detail = await candidateModel.findOne({_id:req.params.id},{mains:1})
        res.send(detail)
    }
    catch(err){
        res.send(err)
    }
})

Router.put("/add/mains",auth,async(req,res)=>{
    try{
        const {profile,coverphoto,shortdescription,social_media} = req.body.requestData
        const {_id} = jwt.decode(req.body.jwt)
        await candidateModel.findByIdAndUpdate(_id,{$set:{'mains.profile':profile,'mains.coverphoto':coverphoto,'mains.shortdescription':shortdescription,'mains.social_media':social_media}})
        res.sendStatus(200)
    }
    catch(err){
        res.sendStatus(403)
    }
})
Router.put("/add/skills",auth,async(req,res)=>{
    try{
        const {_id} = jwt.decode(req.body.jwt)
        const preUpdated = await candidateModel.findById(_id,{skills:1})
        const newSkills = [...preUpdated.skills,...req.body.requestData]
        preUpdated.skills = newSkills
        await candidateModel.findByIdAndUpdate(_id,{$set:{skills:preUpdated.skills}})
        res.sendStatus(200)
    }
    catch(err){
        res.sendStatus(403)
    }
})

Router.put("/add/works",auth,async(req,res)=>{
    try{
        const {_id} = jwt.decode(req.body.jwt)
        const preUpdated = await candidateModel.findById(_id,{works:1})
        const newWorks = [...preUpdated.works.data,...req.body.requestData]
        await candidateModel.findByIdAndUpdate(_id,{$set:{"works.data":newWorks}})
        res.sendStatus(200)
    }
    catch(err){
        res.sendStatus(403)
    }
})
Router.put("/add/projects",auth,async(req,res)=>{
    try{
        const {_id} = jwt.decode(req.body.jwt)
        const preUpdated = await candidateModel.findById(_id,{projects:1})
        const newWorks = [...preUpdated.projects.data,...req.body.requestData]
        await candidateModel.findByIdAndUpdate(_id,{$set:{"projects.data":newWorks}})
        res.sendStatus(200)
    }
    catch(err){
        res.sendStatus(403)
    }
})
Router.put("/add/educations",auth,async(req,res)=>{
    try{
        const {_id} = jwt.decode(req.body.jwt)
        const preUpdated = await candidateModel.findById(_id,{educations:1})
        const newWorks = [...preUpdated.educations.data,...req.body.requestData]
        await candidateModel.findByIdAndUpdate(_id,{$set:{"educations.data":newWorks}})
        res.sendStatus(200)
    }
    catch(err){
        res.sendStatus(403)
    }
})
Router.put("/add/interests",auth,async(req,res)=>{
    try{
        const {_id} = jwt.decode(req.body.jwt)
        const preUpdated = await candidateModel.findById(_id,{interests:1})
        const newWorks = [...preUpdated.interests,...req.body.requestData]
        await candidateModel.findByIdAndUpdate(_id,{$set:{interests:newWorks}})
        res.sendStatus(200)
    }
    catch(err){
        res.sendStatus(403)
    }
})


Router.post("/login",async(req,res)=>{
    try{
        const user = await candidateModel.findOne({email:req.body.email},{email:1,password:1})
        if(user&&user.email){
            const isValidPassword = await bcrypt.compare(req.body.password,user.password)
            if(isValidPassword) res.send({jwt:jwt.sign({_id:user._id,name:user.name,email:user.email},"JWT_PRIVATE_KEY")})
            else res.send({error:"Invalid password"})
        }
        else res.send({error:"Invalid id and password"})
    }
    catch(err){
        res.send({error:err.message})
    }
})
Router.post("/signup",async(req,res)=>{
    try {
        const user = await candidateModel.findOne({email:req.body.email},{email:1})
        if(user){
            res.send({error:"User with the mail Id already exists"})
        }
        else{
            const {name,email,password} = req.body
            const hashedPassword = await bcrypt.hash(password,10)
            const newuser = await new candidateModel({name,email,password:hashedPassword}).save()
            res.send({jwt:jwt.sign({_id:newuser._id,name:newuser.name,email:newuser.email},"JWT_PRIVATE_KEY")})
        }
    } 
    catch (err) {
        res.send({error:err.message})
    }
})
Router.post("/toggle/:obj",auth,async(req,res)=>{
    try{
        if(req.params.obj==="works" || req.params.obj==="educations" || req.params.obj==="projects"){
            const obj = req.params.obj+"."+'display'
            const findState = await candidateModel.findOne({_id:jwt.decode(req.body.jwt)._id},{[obj]:1})
            const result = await candidateModel.updateOne({_id:jwt.decode(req.body.jwt)._id},{$set:{[obj]:!findState[req.params.obj].display}})
            res.end()
        }
        else{
            throw new Error("Invalid selections to hide")
        }
    }
    catch(err){
        res.send(err)
    }
})
module.exports = Router

