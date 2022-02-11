const WSS = require("ws").Server;
const PORT = process.env.PORT;

var PlayerCount = 0;

var Server = new WSS({port: PORT}, () => {
    console.log("Server Started!");
});

Server.on("connection", ws => {
    var PlayerIndex = PlayerCount;
    console.log("New Connection!")
    ws.on("close", async (lol) => {
        console.log("Lost Connection. Index: " + PlayerIndex)
    })
    ws.on("message", async(data) => {
        console.log("Got Message: " + data);
    });
})
