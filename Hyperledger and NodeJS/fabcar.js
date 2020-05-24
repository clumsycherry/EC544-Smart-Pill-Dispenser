/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

// Helper function to convert map to array of javascript objects
const mapToArrayOfObjects = m => {
  return Array.from(m).map( ([k,v]) => {return {[k]:v}} );
};

class FabCar extends Contract {

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        const meds = [
            {
                patient: 'John Snow',
                pid: "23",
                dob: '1990-09-03',
                prescriber: 'user1@org1',
                prescription_date: '2020-03-30',
                medication: 'Tylenol',
                dosage: '250 mg',
                indication: 'Headache',
                count: "20",
                quantity: '2 pills',
                frequency: 'BID',
                restrictions: '1,4',
                progress: '2,4',
                progress_history: [ 
                	{ code: 'Nausea', date: '2020-04-01' },
                	{ code: 'Nausea', date: '2020-04-02' }
                ],
                state: 'taking'
            },
            {
                patient: 'Bellatrix Lestrange',
                pid: "24",
                dob: '1992-02-23',
                prescriber: 'user1@org1',
                prescription_date: '2020-04-01',
                medication: 'Mircette',
                dosage: '50 mg',
                indication: 'Weight',
                count: "28",
                quantity: '1 pill',
                frequency: 'QD',
                restrictions: '3', 
                progress: '1,2,3',
                state: 'taking'
            },
            {
                patient: 'John Snow',
                pid: "23",
                dob: '1990-09-03',
                prescriber: 'user1@org1',
                prescription_date: '2020-03-28',
                medication: 'Seratonin',
                dosage: '75 mg',
                indication: 'Depression',
                count: "90",
                quantity: '2 pill',
                frequency: 'Q8H',
                restrictions: '1',
                progress: '3',
                progress_history: [ 
                	{ code: 'Sadness', date: '2020-03-30' },
                	{ code: 'Sadness', date: '2020-04-03' }
                ],
                state: 'taking'
            }
        ];

        for (let i = 0; i < meds.length; i++) {
            meds[i].docType = 'medication';
            // await ctx.stub.putState('CAR' + i, Buffer.from(JSON.stringify(cars[i])));
            await ctx.stub.putState('M' + (i+1), Buffer.from(JSON.stringify(meds[i])));
            console.info('Added <--> ', meds[i]);
        }
        console.info('============= END : Initialize Ledger ===========');
    }

    async queryCar(ctx, carNumber) {
        const carAsBytes = await ctx.stub.getState(carNumber); // get the car from chaincode state
        if (!carAsBytes || carAsBytes.length === 0) {
            throw new Error(`${carNumber} does not exist`);
        }
        console.log(carAsBytes.toString());
        return carAsBytes.toString();
    }

    async queryMedication(ctx, medNumber) {
        const medAsBytes = await ctx.stub.getState(medNumber); // get the medication from chaincode state
        if (!medAsBytes || medAsBytes.length === 0) {
            throw new Error(`${medNumber} does not exist`);
        }
        console.log(medAsBytes.toString());
        return medAsBytes.toString();
    }

    async createMedication(ctx, medNumber, patient, pid, dob, prescriber, prescription_date, medication, dosage, indication, count, quantity, frequency, restrictions, progress) {
        console.info('============= START : Create Med ===========');

        const med = {
            docType: 'medication',
            patient,
            pid, 
            dob, 
            prescriber, 
            prescription_date,
            medication,
            dosage,
            indication,
            count, 
            quantity, 
            frequency, 
            restrictions, 
            progress, 
            state: 'prescribed'
        };

        await ctx.stub.putState(medNumber, Buffer.from(JSON.stringify(med)));
        console.info('============= END : Create Med ===========');
    }

    async queryAllCars(ctx) {
        const startKey = 'M1';
        const endKey = 'M999';
        const allResults = [];
        for await (const {key, value} of ctx.stub.getStateByRange(startKey, endKey)) {
            const strValue = Buffer.from(value).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push({ Key: key, Record: record });
        }
        console.info(allResults);
        return JSON.stringify(allResults);
    }

    async queryAllPatients(ctx) {
        const startKey = 'M1';
        const endKey = 'M999';
        //const allResults = [];
        // creating a map object 
        var patMap = new Map(); 
        for await (const {key, value} of ctx.stub.getStateByRange(startKey, endKey)) {
            const strValue = Buffer.from(value).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
              
            // Adding [key, value] pair to the map
            if (!patMap.has(record.pid)) {
                var pat = record.pid + " - " + record.patient + " - " + record.dob;
                patMap.set(record.pid, pat);
            }
            
            //allResults.push({ Pid: pid, Patient: pat });
        }
        var jsonText = JSON.stringify(mapToArrayOfObjects(patMap));
        console.info(jsonText);
        return jsonText;
    }

    async queryAllPatientMeds(ctx, pid) {
        const startKey = 'M1';
        const endKey = 'M999';
        // creating a map object 
        var medMap = new Map(); 
        for await (const {key, value} of ctx.stub.getStateByRange(startKey, endKey)) {
            const strValue = Buffer.from(value).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
              
            // Adding [key, value] pair to the map
            if (record.pid == pid && !medMap.has(key)) {
                // Count missed doses and escalations
                var missed = 0;
                var escalate = 0;
                if (record.take_history) {
                    record.take_history.forEach(history => {
                        if (history.timeliness == "9") missed += 1;
                        if (history.escalation != "0") escalate += 1;
                    })
                }
                var med = key + " - " + record.medication + " - " + escalate + " - " + missed + " - " + record.indication;
                medMap.set(key, med);
            }
            
            //allResults.push({ Pid: pid, Patient: pat });
        }
        var jsonText = JSON.stringify(mapToArrayOfObjects(medMap));
        console.info(jsonText);
        return jsonText;
    }

    async queryAllPatientProgress(ctx, pid) {
        const startKey = 'M1';
        const endKey = 'M999';
        // creating a map object 
        var progArray = [];
        var progDate = new Date(); // Now
        progDate.setDate(progDate.getDate() - 31); // Set now - 30 days as the new date
        
        for await (const {key, value} of ctx.stub.getStateByRange(startKey, endKey)) {
            const strValue = Buffer.from(value).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
              
            // Adding [key, value] pair to the array
            if (record.pid == pid && record.progress_history) {
                // Get history less than 31 days old
                record.progress_history.forEach(item => {
                    var histDate = new Date(item.date);
                    if (histDate.getTime() > progDate.getTime())
                        progArray.push({"Medication": record.medication, "Progress_Code":item.code, "Date": item.date});
                })
            }
        }
        var jsonText = JSON.stringify(progArray);
        console.info(jsonText);
        return jsonText;
    }

    async changeCarOwner(ctx, carNumber, newOwner) {
        console.info('============= START : changeCarOwner ===========');

        const carAsBytes = await ctx.stub.getState(carNumber); // get the car from chaincode state
        if (!carAsBytes || carAsBytes.length === 0) {
            throw new Error(`${carNumber} does not exist`);
        }
        const car = JSON.parse(carAsBytes.toString());
        car.owner = newOwner;

        await ctx.stub.putState(carNumber, Buffer.from(JSON.stringify(car)));
        console.info('============= END : changeCarOwner ===========');
    }

    async takePrescription(ctx, medNumber, takeTime, timeliness, escalation) {
    	console.info('============= START : takePrescription ===========');

    	const medAsBytes = await ctx.stub.getState(medNumber); // get the med from chaincode state
        if (!medAsBytes || medAsBytes.length === 0) {
            throw new Error(`${medNumber} does not exist`);
        }
        const med = JSON.parse(medAsBytes.toString());

        console.info("medication: " + medAsBytes.toString());

        if (med.state == 'prescribed') {
        	med.state = 'taking';
        } else if (med.state == 'completed') {
        	return "error"
        }
        
        if (med.take_history) {
        	med.take_history.push({ time: takeTime, timeliness, escalation });
        } else {
        	med.take_history = [{ time: takeTime, timeliness, escalation }];
        }

        await ctx.stub.putState(medNumber, Buffer.from(JSON.stringify(med)));
        console.info('============= END : takePrescription ===========');
    }

    async updateProgress(ctx, medNumber, progressCode, progressDate) {
        console.info('============= START : updateProgress ===========');

        const medAsBytes = await ctx.stub.getState(medNumber); // get the med from chaincode state
        if (!medAsBytes || medAsBytes.length === 0) {
            throw new Error(`${medNumber} does not exist`);
        }
        const med = JSON.parse(medAsBytes.toString());

        console.info("medication: " + medAsBytes.toString());

        if (med.state == 'prescribed') {
            med.state = 'taking';
        } else if (med.state == 'completed') {
            return "error"
        }
        
        if (med.progress_history) {
            med.progress_history.push({ code: progressCode, date: progressDate });      
        } else {
            med.progress_history = [{ code: progressCode, date: progressDate }];
        }

        console.log("medication prog hist: " + med.progress_history);

        await ctx.stub.putState(medNumber, Buffer.from(JSON.stringify(med)));
        console.info('============= END : updateProgress ===========');
    }

}

module.exports = FabCar;
