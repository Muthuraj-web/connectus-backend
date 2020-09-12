const Router = require('express').Router()
const mongoose = require('mongoose')
const candidateModel = require('../models/candidateModel').candidateModel
const jwt = require('jsonwebtoken')
const skillTestModel = require('../models/skillTestModel')

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
Router.post("/checkskill/:skill",auth,async(req,res)=>{
    try{
        const result = await skillTestModel.findOne({skill:req.params.skill})
        if(result){
            res.send()
        }
        else res.send({error:"Sorry Currently we have no skill Test for this skill"})
    }
    catch(err){
        res.send(err)
    }
})
Router.post("/:skill",auth,async(req,res)=>{
    try{
        const result = await skillTestModel.findOne({skill:req.params.skill},{'test.answer':0})
        res.send(result)
    }
    catch(err){
        res.send(err)
    }
})

Router.post("/givegrade/:skill",auth,async(req,res)=>{
    try{
        const result = await skillTestModel.findOne({skill:req.params.skill},{'test.answer':1})
        let total=result.test.length
        for(let i=0;i<result.test.length;i++){
            if(result.test[i].answer !== req.body.answers[i]) total=total-1
        }
        if(((total/result.test.length)*100) >= 80){
            let {skills} = await candidateModel.findById(jwt.decode(req.body.jwt)._id,{skills:1})
            const index = skills.findIndex(each=>each.name===req.params.skill)
            skills[index].verified=true
            const s = await candidateModel.updateOne({_id:jwt.decode(req.body.jwt)._id},{$set:{skills}})
            res.send({result:"pass"})
        }
        else res.send({result:"fail"})
    }
    catch(err){
        res.send(err)
    }
})

module.exports = Router