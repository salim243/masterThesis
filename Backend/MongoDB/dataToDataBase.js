const mongoose = require('mongoose');

// definde the type of data within the post request to atlas
const user = new mongoose.Schema({
       project :{
           type: String
       },
       measuredValue_1:{
        type: Number
       },
       measuredValue_2:{
        type: Number
       },
     
       modelValue:{
           type:Number
       },
       ifc_tag:{
        type: String
    },
    date:{
        type:String
    },
    status:{
        type:String
    },
       diffrence:{
           type: Number
       },
       deviation:{
        type: Number
    },
    measuredValue:{
        type: Number
    },
       
           input:{
type: String
           }
       

})

module.exports = dataToDataBase = mongoose.model('user', user);