const express = require('express');
const path = require('path');
// const plantRoute = require('./routes/plant');

const app = express();

app.use(express.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

// app.use('/images', express.static(path.join(__dirname, 'images')));
// app.use('/plant', plantRoute);

const https = require('https');
var fs = require('fs');

const files = ['api/images/exemple1.jpg'];

const base64files = files.map(file => fs.readFileSync(file, 'base64'));

const plant_id_data = JSON.stringify({
    api_key: "LaMbBrSsOxSRAcbuWPy8GiPWwGvf1YdOefzKQzgYHnATrbhmhr",
    images: base64files,
    /* modifiers info: https://github.com/flowerchecker/Plant-id-API/wiki/Modifiers */
    modifiers: ["crops_fast", "similar_images"],
    plant_language: "en",
    /* plant details info: https://github.com/flowerchecker/Plant-id-API/wiki/Plant-details */
    plant_details: ["common_names",
        "url",
        "name_authority",
        "wiki_description",
        "taxonomy",
        "synonyms"],
});

const options = {
    hostname: 'api.plant.id',
    port: 443,
    path: '/v2/identify',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': plant_id_data.length
    }
}

const req = https.request(options, res => {
    res.on('data', d => {
        process.stdout.write(d)
        //req.end()
    });
});

req.on('error', error => {
  console.error('Error: ', error)
  // res.end()
});

// Route to get plant name (from image)
app.post("/plant/photo", (req, res, next) => {
  res.write(plant_id_data)
  // 
});

app.use((req, res) => {
  res.json({ message: 'No data requested !' }); 
});

module.exports = app;
