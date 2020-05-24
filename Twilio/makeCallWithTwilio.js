// Executed as AWS Lambda Function
// SID and TOKEN are saved as AWS Lambda environment variables

exports.handler = (event, context, callback) => {
// Your Account Sid and Auth Token from twilio.com/console
// DANGER! This is insecure. See http://twil.io/secure
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

var toNumber = event.toNumber;
var msgBody = event.msgBody;

var twimlResponse = '<Response><Say voice="alice">' + msgBody + '</Say></Response>';

client.calls
      .create({
         //url: 'http://demo.twilio.com/docs/voice.xml',  // Default response that comes with code
         twiml: twimlResponse,  // Our response above
         to: toNumber,  // destination phone number
         from: '+16502625169' // our valid Twilio number
       })
      .then((call) => {
            // Success, return message SID
            callback(null, call.sid);
        })
        .catch((e) => {
                // Error, return error object
            callback(Error(e));
        });
};