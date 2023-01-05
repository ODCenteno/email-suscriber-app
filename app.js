require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const { response } = require('express');
const port = process.env.PORT;
const mailchimp = require("@mailchimp/mailchimp_marketing");

mailchimp.setConfig({
  apiKey: process.env.API_KEY,
  server: process.env.SERVER,
});

async function run() {
  const response = await mailchimp.ping.get();
  console.log(response);
}

run();

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

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };
  
  const jsonData = JSON.stringify(data);

  const url = "https://us21.api.mailchimp.com/3.0/list/ec640a6cff";

  const options = {
    method: 'POST',
    auth: "ODCenteno:f04f4c620f9480b6f7a52401f6a755b0-us21"
  };

  const listUpdate = async () => {
    const response = await mailchimp.lists.batchListMembers("ec640a6cff", jsonData);
    if (response.total_created > 0) {
      res.sendFile(__dirname + '/success.html');
    } else {
      res.sendFile(__dirname + '/failure.html');
    }
  };
  
  listUpdate();

  // const request = https.request(url, options, (response) => {
  //   response.on('data', (data) => {
  //     console.log(JSON.parse(data));
  //   });
  // });

  // request.write(jsonData);
  // request.end();
});

app.post('/failure', (req, res) => {
  res.redirect('/');
});

app.post('/success', (req, res) => {
  res.redirect('/');
});

app.listen(port, () => {
  console.log('App is running in port 3000');
});

