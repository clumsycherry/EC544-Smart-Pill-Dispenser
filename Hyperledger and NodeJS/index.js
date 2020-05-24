/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const hlff = require('./hlf_functions.js');
const db = require('./db_functions');
const twilio = require('./twilio_functions');
const cron = require('cron');
// const express = require('express');
// const app = express();
var moment = require('moment');
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
const bodyParser = require('body-parser');
const port = 3000;
app.use(bodyParser.urlencoded({ extended: false }));

var medTaken = 1;
var escalation = 0;
var alertFuncs = [patientText, patientCall, familyText, familyCall];
var ti=0;  // Timeout 'i' tracking variable for escalating alerts

function callAlertFuncs() {
	if (medTaken == 0 && ti < 4) {
		escalation++;
		alertFuncs[ti++]();
		console.log("ti: " + ti);
		if (ti < alertFuncs.length) setTimeout(callAlertFuncs, 60000);
	}
}

function alerts(name, doseTime) {
	medTaken = 0;  // Change to 1 once med taken
	escalation = 0;
	ti = 0;
	console.log("Medication! " + name + ", " + doseTime);
	// Send alert to UI
	var alertText = 'Time to take your <strong>' + name + '</strong>!';
	io.emit('alert', alertText);
	// Set 60 second timer (using setTimeout), then call alert functions
	setTimeout(callAlertFuncs, 60000); //delay start 1 sec.
	// Alert functions:
	// 60 seconds after UI alert, send patient text
	// 60 seconds after patient text, send patient call
	// 60 seconds after patient call, send family text
	// 60 seconds after family text, send family call
	// If at any time the "take medication" button is clicked in the UI, alerts should stop
}

const jobs = [];
var i = 0;
function scheduleJobs(medScheds) {
	let data = JSON.parse(medScheds);
	var count = 0;
	data.forEach(element => {
		var schTime = moment(element.DoseTime, 'HH:mm:ss');
		console.log("element.DoseTime: ", element.DoseTime);
		jobs[i] = cron.job(schTime.minute() + ' ' + schTime.hour() + ' * * *', () => alerts(element.Name, element.DoseTime));
		jobs[i].start();
		i++;
		count++;
	})
}

async function startupSchedule() {
	let medScheds = await db.db_getData("medsched");
	scheduleJobs(medScheds);
}

async function takeMedication(medicationId) {
	medTaken = 1;
	var takeTime = moment().format("h:mm a");
	var timeliness = 0;
	if (escalation > 0)
		timeliness = 1;
	var mId = 'M' + medicationId;
	console.log(mId);
	const result = await hlff.takePrescription(mId, takeTime, timeliness, escalation);
}

server.on('listening', async function () {
    // server ready to accept connections here
    startupSchedule();
});

async function ioQueryDb(dbQuery, pId) {
    let data;
    if (pId) {
    	data = await db.db_getData(dbQuery, pId);
    	console.log("db done (meds): " + data);
    	io.emit('meds', data);
    } else {
    	data = await db.db_getData(dbQuery);
    	console.log("db done: " + data);
    	io.emit('patients', data);
    }    
}

app.get('/', function (req, res) {
	// Return the basic HTML page
	res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
	// socket.emit('news', 'Hello World!');
	socket.on('getPatients', function () {
		ioQueryDb("patients");
	});
	socket.on('getMeds', function (pId) {
		ioQueryDb("meds", pId.pId);
	});
	socket.on('medTaken', function (mId) {
		takeMedication(mId.mId);
	});
});

app.post('/patients', async (req, res) => {
	const { did } = req.body;
	console.log(did);
	if (did)
		res.send('OK'); // ALL GOOD, Lambda can stop processing now
	else {
		res.status(500).send("Missing Doctor Id as 'did'")
		return;
	}
	
	if(did != '51250299')
		return;

	const result = await hlff.patientList(did);

    let record;
    try {
        record = JSON.parse(result);
    } catch (err) {
        console.log(err);
        record = result;
    }
    
    // Need to include the doctorid included in the call so Telegram knows which chat to send the data back to
    var returnData = record;
    // Will be calling Lambda SDK here eventually to return the requested data
    console.log(JSON.stringify(returnData));
    var payload = { doctorid: did, command: "patients", data: returnData };
    console.log(JSON.stringify(payload));
    hlff.sendDataToLambda(payload);
});

app.post('/medlist', async (req, res) => {
	const { did, pid } = req.body;
	console.log(did, pid);
	if (did && pid)
		res.send('OK'); // ALL GOOD, Lambda can stop processing now
	else {
		res.status(500).send("Missing Doctor Id as 'did' and Patient Id as 'pid'")
		return;
	}

	if(did != '51250299')
		return;

	const result = await hlff.medicationList(did, pid);

    let record;
    try {
        record = JSON.parse(result);
    } catch (err) {
        console.log(err);
        record = result;
    }
    
    // Need to include the doctorid included in the call so Telegram knows which chat to send the data back to
    var returnData = record;
    // Will be calling Lambda SDK here eventually to return the requested data
    console.log(JSON.stringify(returnData));
    var payload = { doctorid: did, command: "medlist", data: returnData };
    hlff.sendDataToLambda(payload);
});

app.post('/meddetail', async (req, res) => {
	const { did, mid } = req.body;
	console.log(did, mid);
	if (did && mid)
		res.send('OK'); // ALL GOOD, Lambda can stop processing now
	else {
		res.status(500).send("Missing Doctor Id as 'did' and Medication Id as 'mid'")
		return;
	}
	
	if(did != '51250299')
		return;

	const result = await hlff.medicationDetail(did, mid);

    let record;
    try {
        record = JSON.parse(result);
    } catch (err) {
        console.log(err);
        record = result;
    }
    
    var escalations = [];
    var missedDoses = [];

    if (record.take_history) {
    	record.take_history.forEach(history => {
	        if (history.timeliness == "9") {
	        	missedDoses.push(history.time)
	        }
	        if (history.escalation != "0") {
	        	escalations.push(history.time)
	        }
	    })
    }
    
    // Need to include the doctorid included in the call so Telegram knows which chat to send the data back to
    var escalationText = escalations.length > 0 ? " - Escalations: " + escalations : " - Escalations: 0";
    var missedText = missedDoses.length > 0 ? " - Missed Doses: " + missedDoses : " - Missed Doses: 0";
    var medRecord = record.medication + " - " + record.dosage + " - " + record.frequency + escalationText + missedText;
    var returnData = medRecord;
    // Will be calling Lambda SDK here eventually to return the requested data
    console.log(JSON.stringify(returnData));
    var payload = { doctorid: did, command: "meddetail " + mid, data: returnData };
    hlff.sendDataToLambda(payload);
});

app.post('/progress', async (req, res) => {
	const { did, pid } = req.body;
	console.log(did, pid);
	if (did && pid)
		res.send('OK'); // ALL GOOD, Lambda can stop processing now
	else {
		res.status(500).send("Missing Doctor Id as 'did'")
		return;
	}
	
	if(did != '51250299')
		return;
	
	const result = await hlff.patientProgress(did, pid);

    let record;
    try {
        record = JSON.parse(result);
    } catch (err) {
        console.log(err);
        record = result;
    }
    
    // Need to include the doctorid included in the call so Telegram knows which chat to send the data back to
    var returnData = record;
    // Will be calling Lambda SDK here eventually to return the requested data
    console.log(JSON.stringify(returnData));
    var payload = { doctorid: did, command: "progress", data: returnData };
    hlff.sendDataToLambda(payload);
});

app.post('/progress_update', async (req, res) => {
	const { mid, progid, progdate } = req.body;
	console.log(mid, progid, progdate);
	if (mid && progid && progdate) {
		res.send('OK');
		console.log("all good...processing progress update");  // res.send('OK'); // ALL GOOD, Lambda can stop processing now
	}
	else {
		res.status(500).send("Missing 'mid', 'progid', or 'progdate'")
		return;
	}
	
	const result = await hlff.updateProgress(mid, progid, progdate);

    let record;
    try {
        record = JSON.parse(result);
    } catch (err) {
        console.log(err);
        record = result;
    }
    
    // Hopefully everything went ok...
    // res.send('OK');
});


function patientText() {
	console.log("test1");
	twilio.sendTwilioSMSViaLambda("+18132441147", "ALERT! Time to take your medication");
}

function patientCall() {
	console.log("test2");
	twilio.sendTwilioCallViaLambda("+18132441147", "ALERT! Time to take your medication");
}

function familyText() {
	console.log("test3");
	twilio.sendTwilioSMSViaLambda("+18132441147", "NOTE! Time for your family member to take their medication");
}

function familyCall() {
	console.log("test4");
	twilio.sendTwilioCallViaLambda("+18132441147", "NOTE! Time for your family member to take their medication");
}

server.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));