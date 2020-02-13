const DDPClient = require("ddp");
const readline = require("readline");
const EMAIL = "victor@treestack.io";
const PASSWORD = "xawcym-9mukze-fubwaS";
const URL = "ws://localhost:3000/websocket";


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

    triggerCallMethod(rl, () => callExportMethod(ddpclient) );
});



//HELPER FUNCTIONS

function login(client, username, password) {
    client.call("login", [{ user: { email: username }, password: password}], 
    (err, result) => {
        if (err) console.log("Error!", err);
        console.log("Result: ", result);
    });
}

function callExportMethod(client) {
    client.call(
        "reports.test.doc",
        ["This is a parameter"],
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