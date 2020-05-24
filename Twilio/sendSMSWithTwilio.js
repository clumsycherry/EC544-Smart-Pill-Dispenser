// Executed as AWS Lambda Function
// SID and TOKEN are saved as AWS Lambda environment variables

exports.handler = (event, context, callback) => {

    // Your Account SID from www.twilio.com/console
    // See http://twil.io/secure for important security information
    const accountSid = process.env.TWILIO_ACCOUNT_SID;

    // Your Auth Token from www.twilio.com/console 
    // See http://twil.io/secure for important security information
    const authToken = process.env.TWILIO_AUTH_TOKEN;

    // Import Twilio's Node Helper library
    // Create an authenticated Twilio Client instance
    const client = require('twilio')(accountSid, authToken);
    
    var toNumber = event.toNumber;
    var msgBody = event.msgBody;

    // Send a text message
    client.messages.create({
        body: msgBody || 'Hello from Lambda!',
        to: toNumber,  // destination phone number
        from: '+16502625169' // our valid Twilio number
    })
        .then((message) => {
            // Success, return message SID
            callback(null, message.sid);
        })
        .catch((e) => {
                // Error, return error object
            callback(Error(e));
        });

};