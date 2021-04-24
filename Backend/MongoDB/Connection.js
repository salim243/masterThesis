const mongoose = require('mongoose');

const URL = 'mongodb+srv://Salim:Bi-directional123@cluster0.xr9xu.mongodb.net/Cluster0?retryWrites=true&w=majority';

const connectDB = async ()=>{

   await mongoose.connect(URL, {useNewUrlParser: true,
                                useUnifiedTopology: true});
   console.log('Connection with Database has been established!');
}

module.exports = connectDB;