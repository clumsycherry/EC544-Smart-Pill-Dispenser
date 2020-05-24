// Load the AWS SDK and UUID
var AWS = require('aws-sdk');
var uuid = require('uuid');

var credentials = new AWS.SharedIniFileCredentials({profile: 'default'});
AWS.config.credentials = credentials;
AWS.config.update({region: 'us-east-2'});


function sendTwilioSMSViaLambda(number, msg) {
	// Try sending data to Twilio via Lambda to send an SMS
    var returnData = { toNumber: number, msgBody: msg };
    // var returnData = payload;
    var lambda = new AWS.Lambda();
	var params = {
	  FunctionName: 'sendSMSWithTwilio', /* required */
	  Payload: JSON.stringify(returnData)
	};

	lambda.invoke(params, function(err, data) {
	  if (err) console.log(err, err.stack); // an error occurred
	  else     console.log(data);           // successful response
	});
}

function sendTwilioCallViaLambda(number, msg) {
	// Try sending data to Twilio via Lambda to send an SMS
    var returnData = { toNumber: number, msgBody: msg };
    // var returnData = payload;
    var lambda = new AWS.Lambda();
	var params = {
	  FunctionName: 'makeCallWithTwilio', /* required */
	  Payload: JSON.stringify(returnData)
	};

	lambda.invoke(params, function(err, data) {
	  if (err) console.log(err, err.stack); // an error occurred
	  else     console.log(data);           // successful response
	});
}

module.exports = {
	sendTwilioSMSViaLambda, sendTwilioCallViaLambda
};