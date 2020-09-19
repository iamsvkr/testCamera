const AWS = require('aws-sdk');
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' })
const fs = require('fs');

let initFilePath = '';

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())

AWS.config.apiVersions = {
  rekognition: '2016-06-27'
};

app.post('/', upload.any(), (req, res) => {
  console.log(req.files[0]);

  const bitmap = fs.readFileSync(req.files[0].path);
  initFilePath = req.files[0].path;
  const buffer = new Buffer.from(bitmap, 'base64');

  const rekognition = new AWS.Rekognition({
    accessKeyId: "",
    accessSecretKey: "",
    region: "us-west-2",
  });
  const params = {
    Image: {
      Bytes: buffer
    },
    MaxLabels: '10',
  };
  rekognition.detectLabels(params, (err, data) => {
    if (err) {
      console.log(err);
      res.send(err)
    } else {
      console.log(data);
      res.send(data);
    }
  });
});

app.post('/compare', upload.any(), (req, res) => {
  console.log(req.files[0]);

  const bitmap = fs.readFileSync(req.files[0].path);
  const buffer = new Buffer.from(bitmap, 'base64');

  const bitmap1 = fs.readFileSync(initFilePath);
  const buffer1 = new Buffer.from(bitmap1, 'base64');

  const rekognition = new AWS.Rekognition({
    accessKeyId: "",
    accessSecretKey: "",
    region: "us-west-2",
  });
  const params = {
    SourceImage: { /* required */
      Bytes: buffer1
    },
    TargetImage: { /* required */
      Bytes: buffer
    }
  };
  rekognition.compareFaces(params, (err, data) => {
    if (err) {
      console.log(err);
      res.send(err)
    } else {
      console.log(data);
      res.send(data);
    }
  });
});

app.listen(3000);
