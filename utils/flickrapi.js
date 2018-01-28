var logger = require("./logger");
var flickrapi = require('flickrapi');
var flickr;

const FLICKR_CREDENTIALS = {
    api_key: process.env.FLICKR_API_KEY,
    secret: process.env.FLICKR_SECRET,
    user_id: process.env.FLICKR_USER_ID,
    access_token: process.env.FLICKR_ACCESS_TOKEN,
    access_token_secret: process.env.FLICKR_ACCESS_TOKEN_SECRET,
    requestOptions: {
      timeout: 20000
    }
}

function authenticate(){
  flickrapi.authenticate(FLICKR_CREDENTIALS, function(err, res) {
    // we can now use "flickr" as our API object
    if (err) {
      logger.error(err.message)
      flickr = false;
    }
    else{
      logger.info("Flickr registered")
      flickr = res; 
    }
  });
}

function getClient(){
  return flickr;
}


module.exports = {
    authenticate,
    getClient
};
  /*
var searchOption = {
        tags: 'nba',
        page: 1,
        per_page: 5,
        authenticated: true
      }
      flickr.photos.search(searchOption, function(err, res) {
        // result is Flickr's response
        if (err) {
          logger.error(err.message)
        }
        else{
          logger.info(JSON.stringify(res.photos))
        }
        return;
      });

  */