const https = require('https')
var fs = require('fs');

const files = ['api/images/exemple1.jpg'];

const base64files = files.map(file => fs.readFileSync(file, 'base64'));

function httprequest() {
     return new Promise((resolve, reject) => {
        const data = JSON.stringify({
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
            mode: 'cors',
            cache: 'default',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        }
        const req = https.request(options, (res) => {
          if (res.statusCode < 200 || res.statusCode >= 300) {
                return reject(new Error('statusCode=' + res.statusCode));
            }
            var body = [];
            res.on('data', function(chunk) {
                body.push(chunk);
            });
            res.on('end', function() {
                try {
                    body = JSON.parse(Buffer.concat(body).toString());
                    console.log(body)
                } catch(e) {
                    reject(e);
                }
                resolve(body);
            });
        });
        req.on('error', (e) => {
          reject(e.message);
        });
        // send the request
       req.end();
    });
}

httprequest().then((data) => {
    const response = {
        statusCode: 200,
        body: JSON.stringify(data),
    };
    console.log(response)
    return response;
});