const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const port = 3000;

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/signup.html');
});

app.post('/', (req, res) => {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;
  console.log(firstName, lastName, email);
});

app.listen(port, () => {
  console.log('App is running in port 3000');
});


