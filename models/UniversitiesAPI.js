const express = require('express')
const mongoose = require('mongoose')

const Universities_Schema = mongoose.Schema({
    name:String
})

module.exports = mongoose.model("universities",Universities_Schema,"universities")

