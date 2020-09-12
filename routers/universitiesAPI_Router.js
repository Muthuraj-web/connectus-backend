const UniversitiesAPI_Model = require('../models/UniversitiesAPI')
const Router = require('express').Router()

Router.get("/:name",async(req,res)=>{
    try
    {
        if(req.params.name==="") new Error("Empty University cannot be autocompleted")
        const result = await UniversitiesAPI_Model.find({name:new RegExp(req.params.name,"i")})
        res.send(result)
    }
    catch(err){
        res.send(err.message)
    }})

module.exports = Router