const mongoose = require('mongoose');

const URL = 'mongodb+srv://put-your-data here!@cluster0.xr9xu.mongodb.net/Cluster0?retryWrites=true&w=majority';

const connectDB = async ()=>{

   await mongoose.connect(URL, {useNewUrlParser: true,
                                useUnifiedTopology: true});
   console.log('Connection with Database has been established!');
}

module.exports = connectDB;