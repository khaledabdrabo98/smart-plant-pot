const express = require('express');
const path = require('path');
var multer = require('multer');
const https = require('https');
var fs = require('fs');

const app = express();

app.use(express.json());

app.use(express.urlencoded());

//Setting storage engine
const storageEngine = multer.diskStorage({
  destination: "./api/images",
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
          // process.stdout.write(d);
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

app.post("/plant/id", (req, res, next) => {
  // Next TODO
});

app.use((req, res) => {
  res.json({ message: 'No data requested !' }); 
});

module.exports = app;
