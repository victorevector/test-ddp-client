require('dotenv').config();
const DDPClient = require("ddp");
const readline = require("readline");
const EMAIL = process.env.EMAIL;
const PASSWORD = process.env.PASSWORD;
const URL = process.env.URL;
const REPORTID = process.env.REPORTID;


// read from terminal 
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout, 
    terminal: false
});

// ddp client object
const ddpclient = new DDPClient({
    autoReconnect: true, 
    autoReconnectTimer: 500,
    ddpVersion: '1',
    url: URL
});

// establish a connection 
ddpclient.connect((error, wasReconnect) => {
    if (error) {
        console.log("ERROR!");
        return;
    }
    if (wasReconnect) {
        console.log("Reestablished connection");
    }
    console.log("connected!");

    login(ddpclient, EMAIL, PASSWORD);

    triggerCallMethod(rl, () => callExportMethod(ddpclient, REPORTID) );
});



//HELPER FUNCTIONS

function login(client, username, password) {
    client.call("login", [{ user: { email: username }, password: password}], 
    (err, result) => {
        if (err) console.log("Error!", err);
        console.log("Result: ", result);
    });
}

function callExportMethod(client, reportId) {
    client.call(
        "reports.test.gdoc",
        [reportId],
        (err, result) => {
            if (err) {
                console.log("export method called. ERROR", err);
            }
            console.log("export method called! Result: ", result);
        }
    );
}

function triggerCallMethod(rl, cb) {
    rl.on('line', (line) => {
        console.log("calling method...");
        cb();
    });
}