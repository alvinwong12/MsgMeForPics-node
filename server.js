var express = require('express');
var morgan = require('morgan');
var twilio = require('twilio');
var logger = require("./utils/logger");
const bodyParser = require('body-parser')
var generateResponse = require('./utils/response')
var flickrapi = require('./utils/flickrapi')
var tumblr = require('tumblr.js')
var polling = require('./utils/polling');


const MessagingResponse = twilio.twiml.MessagingResponse;
var app = express();

// Set up logger
if (process.env.NODE_ENV == "development"){
  app.use(morgan("dev", {stream: logger.stream}))
}
else{
  app.use(morgan("tiny", {stream: logger.stream}))
}

var accountSid;
var authToken;

const PORT = process.env.PORT || 3000;

// Get Flickr object
var flickr
var flickrInitTimer
flickrapi.authenticate()

function pollFlickr(){
  logger.info("Polling...")
  if (flickrapi.getClient() == undefined) return;

  if (flickrapi.getClient() == false){
    logger.error('Something went wrong during Flickr authentication')
  }
  else{
    flickr = flickrapi.getClient()
    logger.info('Successfully polled Flickr object');
  }
  polling.endPoll(flickrInitTimer)
}

flickrInitTimer = polling.poll(pollFlickr, 2000)


/*
// Twilio Credentials
if (process.env.NODE_ENV == "test"){
  // Test credentials
  accountSid = ''; 
  authToken = '';  
} else{
  // Real Credentials
  accountSid = '';
  authToken = '';
}
*/
// Twilio client
//const client = twilio(accountSid, authToken);



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



app.use(bodyParser.json())
app.use(bodyParser.raw({ type: 'application/vnd.custom-type' }))
app.use(bodyParser.text({ type: 'text/html' }))
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function (req, res) {
  res.status(200).send('Twilio server 1.0.0');
});


app.post('/', function(req, res, next) {
  logger.info(req.body)
  res.end()
});

app.post('/MessageStatus', function(req,res){
  logger.info(req.body)
});

app.get('/test-flickr', function(req, res){
  if (flickr){
    res.status(200).send();
  }
  else{
    res.status(404).send("Flickr object not found")
  }
})

function generateMediaURL(media, size="medium"){
  const SIZES = {
    small: 'm',
    square: 's',
    thumbnail: 't',
    medium: 'z',
    large: 'b'

  }
  mediaURL =  `https://farm${media.farm}.staticflickr.com/${media.server}/${media.id}_${media.secret}_${SIZES[size]}.jpg`;
  return mediaURL;
}

app.post('/sms', function(req, res, next){
  logger.info(`Received SMS: ${JSON.stringify(req.body)}`)

  const twiml = new MessagingResponse();

  let splitedMsg = req.body.Body.toString().trim().split("%")
  var param = splitedMsg.length > 1 ? splitedMsg[1].trim() : "mms"
  
  var searchOption = {
    tags: splitedMsg[0].trim(),
    content_type: 4,
    media: 'photos',
    page: 1,
    per_page: 1,
    authenticated: true
  }
 
  flickr.photos.search(searchOption, function(err, response) {
    // result is Flickr's response
    if (err) {
      logger.error(err.message)
      res.send(err)
    }
    else{
      //logger.info(JSON.stringify(res.photos))
      photos = response.photos
      let media = generateMediaURL(photos.photo[0]);

      var response = generateResponse(req.body, media, param)
      var message = twiml.message();
      //  Send Respond message
    
      logger.info(`Sending ${response.respondTo} a respond with this response: ${JSON.stringify(response)}`)
      message.body(response.body);
      if (response.media != null) message.media(response.media);
    
      //  Set XML Response header
      res.set('Content-Type', 'text/xml');
      return res.status(200).send(twiml.toString());
    }
    
  });
   
});

/*
// Tumblr
var tumblrClient = tumblr.createClient({
  
});
*/
/*
tumblrClient.taggedPosts('nba', { limit: 1}, function(err, res){
  if (err) logger.info(err.message + " " + err);
  logger.info(JSON.stringify(res));
});

*/

app.listen(PORT, function () {
  logger.info(`Listening on port ${PORT}`);

});


