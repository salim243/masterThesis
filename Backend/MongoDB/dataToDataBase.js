const mongoose = require('mongoose');

// definde the type of data within the post request to atlas
const user = new mongoose.Schema({
       project :{
           type: String
       },
       measuredValue:{
        type: Number
       },
     
       realValue:{
           type:Number
       },
       ifc_tag:{
        type: String
    },
    date:{
        type:String
    },
       diffrence:{
           type: Number
       },
       
           input:{
type: String
           }
       

})

module.exports = dataToDataBase = mongoose.model('user', user);