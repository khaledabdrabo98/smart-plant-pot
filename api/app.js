const express = require('express');
const path = require('path');
var multer = require('multer');
const https = require('https');
const fetch = require('node-fetch')
var fs = require('fs');
const multiparty = require('multiparty');
var bodyParser = require('body-parser')
var qs = require('querystring');
const app = express();

app.use(express.json());

app.use(express.urlencoded());

//Setting storage engine
const storageEngine = multer.diskStorage({
  destination: "./images",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}--${file.originalname}`);
  },
});

const checkFileType = function (file, cb) {
  //Allowed file extensions
  const fileTypes = /jpeg|jpg|png/;

  //check extension names
  const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType = fileTypes.test(file.mimetype);

  if (mimeType && extName) {
    return cb(null, true);
  } else {  
    cb("Error: You can Only Upload Images!!");
  }
};

const upload = multer({
  storage: storageEngine,
  limits: { fileSize: 10000000 },
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

// Route to get plant info (from image)
// API used to get plant name and info : https://plant.id/
app.post("/plant/photo", upload.single("image"), (req, res) => {
  //req.file = bodyParser.json(req.file)
  console.log(req.file)
  if (req.file) {
    const files = [ req.file.path ]; 
    const base64files = files.map(file => fs.readFileSync(file, 'base64'));

    const plant_id_data = JSON.stringify({
        api_key: "qhxxYbzOI1LgAt0y7wacRHc7nfZhr67A7ScBEQaKkUK2ZZLwwO",
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

    var message = "";
    req = https.request(options, response => {
      response.on('data', d => {
          // console.log(d);
          message += d; 
      }).on('end', () => {
          res.json({ message: JSON.parse(message).suggestions });  
      });
    });
    
    req.on('error', error => {
      console.error('Error: ', error)
    });

    req.write(plant_id_data)
    req.end()

  } else {
    res.status(400).send("Please upload a valid image");
  }
});

async function generateAccessToken() {
  const client_id = 'snJvXG0PLhLxuwyvm6R4njBkQYzRPfgBKIyC3o5k';
  const client_secret = 'tVxOzcWO7tD3KsQ2EmK1oYLKS0Z3Z6a41oaTkg9OxmGtTLFelu0nx1FD677BTSfH4iBv2AI24zEDKt7klGTTa6q4xBopzk2ReYA6nVL2J8tiflnADzXRMfwnE8N3uXzQ';
  const response = await fetch('https://open.plantbook.io/api/v1/token/', {
    method: 'POST',
    body: "grant_type=client_credentials",
    headers: {
      'Content-Type': 'application/json',
      Authorization: "Basic " + Buffer.from(client_id + ":" + client_secret).toString("base64"),
    },
  });
  const data = await response.json();
  return data;
}

// Route to get plant name in PlantBook API (from suggestions or user)
// API used to get plant name : https://open.plantbook.io/
app.get("/plant/id", async (req, res, next) => {
  //const token = await generateAccessToken();
  const token = '2b429b6b5f3ee2b94db387b9ba9487a374b932c1';
  const alias = JSON.parse(req.query.alias).replace(/ /g, '%20');

  const options = {
    hostname: 'open.plantbook.io',
    path: '/api/v1/plant/search?limit=3&alias=' + alias,
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + token
    }
  }

  var message = "";
  req = https.request(options, response => {
    response.on('data', d => {
        // process.stdout.write(d);
        message += d; 
    }).on('end', () => {
        res.json({ message: JSON.parse(message) });  
    });
  });

  req.on('error', error => {
    console.error('Error: ', error)
  });

  req.end()
});

// Route to get plant needs from PlantBook API using searched name
// Then save plant details in ./myplant.json
// API used to get plant data : https://open.plantbook.io/
app.get("/plant/stats", (req, res, next) => {
  //const token = await generateAccessToken();
  //console.log(token)
  const token = '2b429b6b5f3ee2b94db387b9ba9487a374b932c1';
  const plant_pid = JSON.parse(req.query.plant_pid).replace(/ /g, '%20');

  const options = {
    hostname: 'open.plantbook.io',
    path: '/api/v1/plant/detail/' + plant_pid + '/',
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + token
    }
  }
  var message = "";
  req = https.request(options, response => {
    response.on('data', d => {
        // process.stdout.write(d);
        message += d; 
    }).on('end', () => {
        // Parse JSON
        var jsonObj = JSON.parse(message);
        
        // Stringify JSON Object
        var jsonContent = JSON.stringify(jsonObj);
        
        // Write in myplant.json file
        fs.writeFile("myplant.json", jsonContent, 'utf8', function (err) {
            if (err) {
                console.log("An error occured while writing JSON object to file.");
                return console.log(err);
            }
        
            console.log("Plant details saved.");
            res.json({ message: jsonObj }); 
        }); 
    });
    req.on('error', error => {
      console.error('Error: ', error)
    });
  
  });
  
  req.end()
});

// Route to get (fetch) current plant data 
// Plant details can be found in ./myplant.json
app.get("/plant/myplant", (req, res, next) => {
  let rawdata = fs.readFileSync('./myplant.json');
  if (Object.keys(rawdata).length === 0 && rawdata.constructor === Object) {
    let err = "An error occured while reading JSON object from file.";
    console.log(err);
    res.status(404).json({ message: err})
  } else {
    let plant = JSON.parse(rawdata);
    res.json({ message: plant }); 
    console.log(plant);
  }
});

app.get("/plant/moist_level", (req, res, next) => {
  let rawdata = fs.readFileSync('./myplant_status.json');
  if (Object.keys(rawdata).length === 0 && rawdata.constructor === Object) {
    let err = "An error occured while reading JSON object from file.";
    console.log(err);
    res.status(404).json({ message: err})
  } else {
    let plant_status = JSON.parse(rawdata);
    res.json({ message: plant_status }); 
  }
});

app.post("/plant/update", (req, res, next) => {
  
  req.on('end', function () {
    var body = qs.parse(req.body);
    const moist_level = body.moistureState;

    var moist_json = { "current_moist_level": moist_level };
          
    // Stringify JSON Object
    var jsonContent = JSON.stringify(moist_json);
    
    // Write in myplant.json file
    fs.writeFile("myplant_status.json", jsonContent, 'utf8', function (err) {
        if (err) {
            console.log("An error occured while writing JSON object to file.");
            return console.log(err);
        }
    
        console.log("Plant details saved.");
        res.json({ message: moist_json }); 
    });
    req.end(); 
  });
});

app.use((req, res) => {
  res.json({ message: 'No data requested !' }); 
});

module.exports = app;
