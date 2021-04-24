const express = require('express');
const app = express();
var axios = require('axios');
const connectDB = require('./MongoDB/Connection');
const { createWorker } = require('tesseract.js');
var cloudinary = require('cloudinary').v2;
const worker = createWorker();
var qs = require('qs');
const { response } = require('express');

connectDB();
app.use(express.json({extended:false}));
app.use('/API/userModel', require("./API/User"));

cloudinary.config({
    cloud_name: 'masterthesis',
    api_key: '221589929542779',
    api_secret: 'Efjf459GQCLOT37W8JJ_Zg9x-xA'
});

// upload image and run the OCR in the call back! 
/* cloudinary.uploader.upload("./images/tagProbe.jpg", { public_id: "OCR-image" },
    function (error, result) {

        url = result["url"];

        (async () => {
            await worker.load();
            await worker.loadLanguage('eng');
            await worker.initialize('eng');

            const { data: { text } } = await worker.recognize(url);
            //console.log(text);
            await worker.terminate();

                    
            app.get('/text', (req, res) => {
                res.send(text);
            })

            
        })();

    });
 */
     cloudinary.api.resources(
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
    
    
    
    
    
    }); 

//    ##  Authenticate  ##

var data = qs.stringify({
    'grant_type': 'client_credentials',
    'client_id': 'tx5kNdpSLava5nlylUegwSzNDCboHEDw',
    'client_secret': 'vktZuS3VtFO9jSMr',
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

    //Urn and ModelGuid are hard-coded. Model was uploaded using Postman. 
    const accessToken = await getToken();

    var config = {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    };
    const metaData = await axios.get('https://developer.api.autodesk.com/modelderivative/v2/designdata/dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6dHg1a25kcHNsYXZhNW5seWx1ZWd3c3puZGNib2hlZHcvY2FzZTEuaWZj/metadata/40022da7-4931-4999-a3a0-5e56f1cfdf0b/properties', config);


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