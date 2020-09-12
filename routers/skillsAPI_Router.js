const SkillsAPI_Model = require('../models/SkillsAPIModel')
const Router = require('express').Router()

Router.get("/:skill",async(req,res)=>{
    try
    {
        if(req.params.skill==="") new Error("Empty skill cannot be autocompleted")
        const skill= {skill:new RegExp(`^${req.params.skill}`,"i")}
        const result = await SkillsAPI_Model.find(skill)
        res.send(result)
    }
    catch(err){
        res.send(err.message)
    }
})


module.exports = Router
