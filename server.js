var express = require('express');
var app = express();
var morgan = require('morgan');
var twilio = require('twilio');
var logger = require("./utils/logger");
const bodyParser = require('body-parser')
var generateResponse = require('./utils/response')

const MessagingResponse = twilio.twiml.MessagingResponse;

var accountSid;
var authToken;

const PORT = process.env.PORT || 3000;

// Twilio Credentials
if (process.env.NODE_ENV == "test"){
  // Test credentials
  accountSid = 'AC8fc564869c3c3e057670c9903e610507'; 
  authToken = 'a2bc6ad271e6c4df30e0be5450c8d103';  
} else{
  // Real Credentials
  accountSid = 'ACf972b5e3e131db53f9ca3b3bbf511ec7';
  authToken = '2bb63f28b36973a0b0d8a7d7ee5f86d4';
}

// Twilio client
const client = twilio(accountSid, authToken);

var message;
if (process.env.NODE_ENV == "development"){
  message = {
    to: '+15005550001',
    from: '+15005550006',
    body: 'Hello World',
  }
}
else{
  message = {
    to: '+15005550001',
    from: '+16474926563',
    body: 'Hello World',
    
  }
}

/*
client.messages.create(message, function(err, res){
  if (err){
    logger.info(accountSid);
    logger.info(authToken)
    logger.error(err.message + " Status: " + err.status);
    //client.messages.each((message) => console.log(message.body));
  }
  else{
    logger.info("Status: " + res.status + ". " + res.sid)
    
  }

});
*/

/*
messageSid = "SMfa237b0157f04ca2b9e1f8f0f904be36"
client.messages(messageSid).remove()
          .then(() => console.log("Message deleted"))
          .catch((err) => console.error(err));
*/
//client.messages.each((message) => message.remove());


if (process.env.NODE_ENV == "development"){
  app.use(morgan("dev", {stream: logger.stream}))
}
else{
  app.use(morgan("tiny", {stream: logger.stream}))
}

app.use(bodyParser.json())
app.use(bodyParser.raw({ type: 'application/vnd.custom-type' }))
app.use(bodyParser.text({ type: 'text/html' }))
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function (req, res) {

  res.send('Hello World!');
});


app.post('/', function(req, res, next) {
  logger.info(req.body)
  res.end()
});

app.post('/MessageStatus', function(req,res){
  logger.info(req.body)
});



app.post('/sms', function(req, res, next){
  logger.info(`Received SMS: ${JSON.stringify(req.body)}`)

  const twiml = new MessagingResponse();

  var response = generateResponse(req.body)
  var message = twiml.message();
  //  Send Respond message

  logger.info(`Sending ${response.respondTo} a respond with this response: ${JSON.stringify(response)}`)
  message.body(response.body);
  if (response.media != null) message.media(response.media);

  //  Set XML Response header
  res.set('Content-Type', 'text/xml');
  return res.status(200).send(twiml.toString());
});


app.listen(PORT, function () {
  logger.info(`Listening on port ${PORT}`);
});


