var logger = require("./logger");
var flickrapi = require('flickrapi');
var flickr;

const FLICKR_CREDENTIALS = {
    api_key: 'ddbf7ad260187ed55fce77300c411d8a',
    secret: 'b79bd7a7e99ebf1f',
    user_id: "154881801@N04",
    access_token: '72157689409023612-f777f6e48db299ba',
    access_token_secret: '95fb94cc3b2dbf9c',
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