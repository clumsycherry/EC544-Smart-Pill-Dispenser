### EC544 Smart Pill Dispenser: Hyperledger and NodeJS Folder
The files in this folder were used to modify the functionality of the Hyperledger Fabric "Fabcar" example network and to create the NodeJS applications for use in this project.  

* **db_functions.js**: Helper functions to connect to local MariaDB database and query for patient and medication data; used by index.js to keep the web server and database functionality separate.
* **fabcar.js**: The smart contract that runs on the Hyperledger Fabric network to execute code and add information to the blockchain. 
* **hlf_functions.js**: Helper functions to connect to Hyperledger and query for results and also return data to Lambda via SDK calls; used by index.js to keep the web server and blockchain/AWS functionality separate.  
* **index.html** The web interface supplied by Node to the medication taker to "fingerprint authenticate" and take meds. 
* **index.js** The web server code used by Node to receive POSTs from Lambda and provide the UI for the medication taker. 
* **twilio_functions.js**: Helper functions to connect to Twilio via Lambda to send text and voice alerts; used by index.js to keep the web server and Twilio functionality separate.  

 