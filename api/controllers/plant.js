const https = require('https')
var fs = require('fs');

const files = ['./exemple1.jpeg'];

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
    });
});

req.on('error', error => {
    console.error('Error: ', error)
});

req.write(plant_id_data)

req.end()