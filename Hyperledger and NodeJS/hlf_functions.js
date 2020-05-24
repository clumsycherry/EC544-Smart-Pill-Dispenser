const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');

// Load the AWS SDK and UUID
var AWS = require('aws-sdk');
var uuid = require('uuid');

// Verify AWS Credentials Loaded
// AWS.config.getCredentials(function(err) {
//   if (err) console.log(err.stack);
//   // credentials not loaded
//   else {
//     console.log("Access key:", AWS.config.credentials.accessKeyId);
//     console.log("Secret access key:", AWS.config.credentials.secretAccessKey);
//   }
// });
// Then set the AWS region (required)
var credentials = new AWS.SharedIniFileCredentials({profile: 'default'});
AWS.config.credentials = credentials;
AWS.config.update({region: 'us-east-2'});


async function connectNetwork() {
	// load the network configuration
	const ccpPath = path.resolve(__dirname, '..', '..', 'first-network', 'connection-org1.json');
	const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

	// Create a new file system based wallet for managing identities.
	const walletPath = path.join(process.cwd(), 'wallet');
	const wallet = await Wallets.newFileSystemWallet(walletPath);
	// console.log(`Wallet path: ${walletPath}`);

	// Check to see if we've already enrolled the user.
	const identity = await wallet.get('user1');
	if (!identity) {
	    console.log('An identity for the user "user1" does not exist in the wallet');
	    console.log('Run the registerUser.js application before retrying');
	    return;
	}

	// Create a new gateway for connecting to our peer node.
	const gateway = new Gateway();
	//await gateway.connect(ccp, { wallet, identity: 'user1', discovery: { enabled: true, asLocalhost: true } });
	await gateway.connect(ccp, { wallet, identity: 'user1' });

	// Get the network (channel) our contract is deployed to.
	const network = await gateway.getNetwork('mychannel');

	// Get the contract from the network.
	const contract = network.getContract('fabcar');
	return contract;
}



// Returns list of all patients
// Return: PatientID - Patient Name - DOB
async function patientList(doctorId) {
	// Evaluate the specified transaction.
    var contract = await connectNetwork();
    const result = await contract.evaluateTransaction('queryAllPatients');
	return result;
}

// Returns list of all medications for an input patient ID
// Return: MedID# - Medication Name - [# of escalations] - [# of missed doses] - Treatment (why taking this medication)
async function medicationList(doctorId, patientId) {
    // Evaluate the specified transaction.
    var contract = await connectNetwork();
    const result = await contract.evaluateTransaction('queryAllPatientMeds', patientId);
    return result;
}

// Returns list of medication details for an input medication ID
// Return: MedID# - Medication Name - [# of escalations] - [# of missed doses] - Treatment (why taking this medication)
async function medicationDetail(doctorId, medicationId) {
	// Evaluate the specified transaction.
    var contract = await connectNetwork();
    const result = await contract.evaluateTransaction('queryMedication', medicationId);
    return result;
}

// Returns list of patient "progress" question results for an input patient ID
// Return: MedID# - Medication Name - [# of escalations] - [# of missed doses] - Treatment (why taking this medication)
async function patientProgress(doctorId, patientId) {
	// Evaluate the specified transaction.
    var contract = await connectNetwork();
    const result = await contract.evaluateTransaction('queryAllPatientProgress', patientId);
    return result;
}

// Inserts patient "progress" question results for an input medication ID, progress code, and progress date
// No Return, really....success maybe?
async function updateProgress(medicationId, progressCode, progressDate) {
	// Evaluate the specified transaction.
    var contract = await connectNetwork();
    const result = await contract.submitTransaction('updateProgress', medicationId, progressCode, progressDate);
    return result;
}

// Inserts patient "progress" question results for an input medication ID, progress code, and progress date
// No Return, really....success maybe?
async function takePrescription(medicationId, takeTime, timeliness, escalation) {
	// Evaluate the specified transaction.
    var contract = await connectNetwork();
    const result = await contract.submitTransaction('takePrescription', medicationId, takeTime, timeliness, escalation);
    return result;
}


function sendDataToLambda(payload) {
	// Try sending data to Telegram via Lambda
    // var returnData = { name: "Matt's NodeJS", email: "mcboyd@bu.edu", message: payload };
    var returnData = payload;
    var lambda = new AWS.Lambda();
	var params = {
	  FunctionName: 'send-telegram-message', /* required */
	  Payload: JSON.stringify(returnData)
	};

	lambda.invoke(params, function(err, data) {
	  if (err) console.log(err, err.stack); // an error occurred
	  else     console.log(data);           // successful response
	});
}


module.exports = {
	patientList, medicationList, medicationDetail, patientProgress, updateProgress, takePrescription, sendDataToLambda
};