const express = require('express');
const mongoose = require('mongoose');
const User = require('../MongoDB/dataToDataBase')
const router = express.Router();

//create the post request based on the data definded in MongoDB file

router.post('/',async (req,res)=>{
    const {project,measuredValue,realValue,ifc_tag,date,input} = req.body;
    let name = {};
    name.project = project;
    name.measuredValue = measuredValue;
    name.realValue = realValue;
    name.ifc_tag = ifc_tag;
    name.date= date;
    name.input = input;



    let userModel = new User(name);
    await userModel.save();
    res.json(userModel);
});

module.exports =router;