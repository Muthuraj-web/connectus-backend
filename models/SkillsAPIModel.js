const express = require('express')
const mongoose = require('mongoose')

const skillsAPI_Schema = mongoose.Schema({
    skill:String
})

const skills_Model = mongoose.model('skill',skillsAPI_Schema)

module.exports = skills_Model