exports.handler = function(event, context, callback) {
   console.log("Received event: ", event);
   var data = {
       "greetings": "Hello, " + event.firstName + " " + event.lastName + "."
   };
   callback(null, data);
}
//zip function.zip index.js -- create a deployment package
//create a lambda function with create-function command
//aws lambda create-function