const candidateModel = require("../models/candidateModel").candidateModel
const companyModel = require("../models/companyModel")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const Router = require("express").Router()

const auth = async(req,res,next)=>{
    try{
        const {_id} = jwt.decode(req.body.jwt)
        await companyModel.findById(_id)
        next()
    }
    catch(err){
        res.sendStatus(401)
    }

}

Router.get('/hire',async(req,res)=>{
    try{
        
    const {role,skills,minExp,maxExp,sortByExp} = req.query
    const arr =["January","February","March","April","May","June","July","August","September","October","November","December"]
    let query = [
        {
            $match: {
                interests:{ $in:[role] },
                "skills.name":{ $all:skills.split(", ") }
            }
        }, 
        {
            $project: {
                name:1,
                email:1,
                skills:"$skills.name",
                profile:"$mains.profile",
                experience:{
                    $map:{
                        input:"$works.data",
                        as:"t",
                        in:{
                            $cond:[
                                { $eq:["$$t.role",role] },
                                {
                                    $cond:[
                                        { $eq:["$$t.timeline.start.year","$$t.timeline.end.year"] },
                                        { 
                                            $let:{
                                                vars:{
                                                    months:["January","February","March","April","May","June","July","August","September","October","November","December"],
                                                },
                                                in:{
                                                    $divide:[
                                                        {
                                                            $subtract:[
                                                                {
                                                                    $indexOfArray:["$$months","$$t.timeline.end.month"]
                                                                },
                                                                {
                                                                    $indexOfArray:["$$months","$$t.timeline.start.month"]
                                                                }
                                                            ]
                                                        },
                                                        12
                                                    ]
                                                }
                                            }
                                        },
                                        {
                                            $add:[
                                                {
                                                    $divide:[
                                                        {
                                                            $let:{
                                                                vars:{
                                                                    months:["January","February","March","April","May","June","July","August","September","October","November","December"],
                                                                },
                                                                in:{
                                                                    $add:[
                                                                        {
                                                                            $subtract:[
                                                                                12,
                                                                                {
                                                                                    $indexOfArray:["$$months","$$t.timeline.start.month"]
                                                                                }
                                                                            ]
                                                                        },
                                                                        {
                                                                            $indexOfArray:["$$months","$$t.timeline.end.month"]
                                                                        }
                                                                    ]
                                                                }
                                                            }
                                                        },
                                                        12
                                                    ]
                                                },
                                                {
                                                    $subtract:[
                                                        "$$t.timeline.end.year",
                                                        {
                                                            $add:[
                                                                "$$t.timeline.start.year",
                                                                1
                                                            ]
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                },
                                0
                            ]
                        }
                    }
                }
            }
        },
        {
            $addFields:{
                experience:{
                    $sum:"$experience"
                }
            }
        },
        {
            $match:{
                experience:{$gte:Number(minExp)},
                experience:{$lte:Number(maxExp)}
            }
        },
        {
            $sort:{
                experience:Number(sortByExp)
            }
        }
    ]
    const result = await candidateModel.aggregate(query)
    res.send(result)
    }
    catch(err){
        res.send(err)
    }
})
Router.get("/:id",async(req,res)=>{
    try{
        const result = await companyModel.findById(req.params.id,{pasword:0})
        res.send(result)
    }
    catch(err){
        res.send(er.message)
    }
})

Router.get("/mains/:id",async(req,res)=>{
    try{
        const detail = await companyModel.findOne({_id:req.params.id},{mains:1})
        res.send(detail)
    }
    catch(err){
        console.log(err)
    }
})


Router.put("/add/mains",auth,async(req,res)=>{
    try{
        const {profile,coverphoto,shortdescription,social_media} = req.body.requestData
        const {_id} = jwt.decode(req.body.jwt)
        await companyModel.findByIdAndUpdate(_id,{$set:{'mains.profile':profile,'mains.coverphoto':coverphoto,'mains.shortdescription':shortdescription,'mains.social_media':social_media}})
        res.sendStatus(200)
    }
    catch(err){
        res.send(err.message)
    }

})
Router.put("/add/aboutus",auth,async(req,res)=>{
    try{
        const {aboutus} = req.body.requestData
        const {_id} = jwt.decode(req.body.jwt)
        await companyModel.findByIdAndUpdate(_id,{$set:{aboutus}})
        res.sendStatus(200)
    }
    catch(err){
        res.send(err.message)
    }

})
Router.post("/login",async(req,res)=>{
    try{
        const user = await companyModel.findOne({email:req.body.email},{email:1,password:1})
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
    try{
        const {company,email,password} = req.body
        const user = await companyModel.findOne({$or:[{email},{company}]},{email:1,company:1})
        if(user&&user.company===company){
            res.send({error:"Company with this name already exists"})
        }
        else if(user&&user.email===email){
            res.send({error:"Company with the email ID already exists"})
        }
        const hashed = await bcrypt.hash(password,10)
        const newuser = await new companyModel({company,email,password:hashed}).save()
        res.send({jwt:jwt.sign({_id:newuser._id,company:newuser.company,email:newuser.email},"JWT_PRIVATE_KEY")})
    } 
    catch(err){
        res.send({error:err.message})
    }
})
module.exports = Router