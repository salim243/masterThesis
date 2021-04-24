const express = require('express');
const app = express();
var axios = require('axios');
const connectDB = require('./MongoDB/Connection');
const { createWorker } = require('tesseract.js');
var cloudinary = require('cloudinary').v2;
const worker = createWorker();
const worker1 = createWorker();

var qs = require('qs');
const { response } = require('express');



app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });





connectDB();
app.use(express.json({extended:false}));
app.use('/API/userModel', require("./API/User"));

//you get these Info from Cloudianry
cloudinary.config({
    cloud_name: 'masterthesis',
    api_key: '',
    api_secret: ''
});
//first one

// upload image and run the OCR in the call back! is this efficient ? 
 cloudinary.uploader.upload("./images/id586.jpg", { public_id: "OCR-image" },
    function (error, result) {

        url1 = result["url"];

        (async () => {
            await worker1.load();
            await worker1.loadLanguage('eng');
            await worker1.initialize('eng');

            const { data: { text } } = await worker1.recognize(url1);
            console.log(text);
            await worker1.terminate();

                    
            app.get('/text', (req, res) => {
                res.send(text);
            })

            
        })();
       
    }); 

    // get the latest image uploaded to cloudinary. The image can be uploaded directly from a mobile phone
    
  /* cloudinary.api.resources(
   async function(error, result) {
      let url = await result.resources[0]["url"];
    
      (async () => {
        await worker.load();
        await worker.loadLanguage('eng');
        await worker.initialize('eng');

        const { data: { text } } = await worker.recognize(url);
        console.log(text);
        await worker.terminate();
 
                
        app.get('/text', (req, res) => {
            res.send(text);
        })
        
         
    })();
    
    
    
    
    
    });  */


//    ##  Authenticate  ##

//this Info is from Forge
var data = qs.stringify({
    'grant_type': 'client_credentials',
    'client_id': '',
    'client_secret': '',
    'scope': 'data:read data:write data:create bucket:read bucket:create'
});

const getToken = async () => {

    const token = await axios.post('https://developer.api.autodesk.com/authentication/v1/authenticate', data);

    app.get('/token', (req, res) => {
        res.send(token.data.access_token);
    })
    return token.data.access_token;
}
getToken();
 

// ##   get Metadata from Forge  ##
var tags = [];
async function getMetaData() {

    //Urn and ModelGuid are hard-coded.
    //dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6cHA0bXF2YzZxend5c2diY2d1MHZ5ZWV6YmhleXUwZW8vdGVzdDEuaWZj
    //cc899025-1ed2-4c89-9c43-9b9bf917da02
    const accessToken = await getToken();

    var config = {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    };
    const metaData = await axios.get('https://developer.api.autodesk.com/modelderivative/v2/designdata/dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6cHA0bXF2YzZxend5c2diY2d1MHZ5ZWV6YmhleXUwZW8vdGVzdDEuaWZj/metadata/cc899025-1ed2-4c89-9c43-9b9bf917da02/properties', config);


    const ifcTags = metaData.data.data.collection;

    return ifcTags;
}

getMetaData();


async function sendTags() {
    const tags = await getMetaData();
    app.get('/metadata', (req, res) => {
        res.send(tags);
    })
}
sendTags();

 
app.listen(3000);