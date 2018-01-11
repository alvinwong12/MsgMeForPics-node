var logger = require("./logger");

const testPic = "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Node.js_logo.svg/1200px-Node.js_logo.svg.png"

function generateResponse(incomeSMS){
  var body, media;
  if (!(incomeSMS.Body)){
    body = "Please tell me what you want to search"
    media = null;
  }
  else if (!(incomeSMS.Body.toString().trim())){
    body = "Cannot search for a picture because you have only enter empty spaces";
    media = null;
  }
  else{
    body = `Here is a picture of ${incomeSMS.Body.toString().trim()}`
    media = testPic
  }
  var respondTo = incomeSMS.From

  var response = {
    "body": body,
    "media": media,
    "respondTo": respondTo
  }

  return response
}

module.exports = generateResponse;