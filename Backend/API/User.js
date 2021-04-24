const express = require('express');
const mongoose = require('mongoose');
const User = require('../MongoDB/dataToDataBase')
const router = express.Router();

//create the post request based on the data definded in MongoDB file

router.post('/',async (req,res)=>{
    const {project,measuredValue,measuredValue_1,measuredValue_2,status,deviation,modelValue,ifc_tag,date,input} = req.body;
    let name = {};
    name.project = project;
    name.measuredValue_1 = measuredValue_1;
    name.measuredValue_2 = measuredValue_2;
    name.measuredValue=measuredValue;
    name.deviation=deviation;
    name.status=status
    name.modelValue = modelValue;
    name.ifc_tag = ifc_tag;
    name.date= date;
    name.input = input;



    let userModel = new User(name);
    await userModel.save();
    res.json(userModel);
});

module.exports =router;