var logger = require("./logger");

const testPic = "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Node.js_logo.svg/1200px-Node.js_logo.svg.png"

function generateResponse(incomeSMS, media = null, param = "mms"){
  var body;
  if (!(incomeSMS.Body)){
    body = "Please tell me what you want to search"
  }
  else if (!(incomeSMS.Body.toString().trim())){
    body = "Cannot search for a picture because you have only enter empty spaces";
  }
  else{
    body = `Here is a picture of ${incomeSMS.Body.toString().trim().split("%")[0].trim()}`
    //media = testPic
  }
  var respondTo = incomeSMS.From

  if (param == "sms"){
    body += `. URL: ${media}`;
    media = null;
  }
  var response = {
    "body": body,
    "media": media,
    "respondTo": respondTo
  }

  return response
}

module.exports = generateResponse;