const WSS = require("ws").Server;
const PORT = process.env.PORT || 1234;
const { warn, log } = require('console');

var Server = new WSS({ port: PORT }, () => {
    log("Server Started!");
});

function GetWeaponClassName(Class) {
    switch (Class) {
        case 0: {
            return "EggK-47";
        }
        case 1: {
            return "Scrambler";
        }
        case 2: {
            return "Free Ranger";
        }
        case 3: {
            return "RPEGG";
        }
        case 4: {
            return "Whipper";
        }
        case 5: {
            return "Crackshot";
        }
        case 6: {
            return "Tri-Hard";
        }
    }
}

function GetMaxAmmo(Class) {
    switch (Class) {
        case 0: {
            return 231;
        }
        case 1: {
            return 24;
        }
        case 2: {
            return 60;
        }
        case 3: {
            return 3;
        }
        case 4: {
            return 200;
        }
        case 5: {
            return 20;
        }
        case 6: {
            return 150;
        }
    }
}

function GetMaxRounds(Class) {
    switch (Class) {
        case 0: {
            return 30;
        }
        case 1: {
            return 2;
        }
        case 2: {
            return 15;
        }
        case 3: {
            return 1;
        }
        case 4: {
            return 40;
        }
        case 5: {
            return 1;
        }
        case 6: {
            return 24;
        }
    }
}

let ut = function (e, t) {
    this.size = 0,
        this.originalSize = t,
        this.constructorFn = e,
        this.objects = [],
        this.idx = 0,
        this.numActive = 0,
        this.expand(t)
}
ut.prototype.expand = function (e) {
    for (var t = 0; t < e; t++) {
        var r = this.constructorFn();
        r.id = t + this.size,
            r.active = !1,
            this.objects.push(r)
    }
    this.size += e
}
ut.prototype.retrieve = function (e) {
    if (null != e) {
        for (; e >= this.size;)
            this.expand(this.originalSize);
        return this.numActive++,
            this.objects[e].active = !0,
            this.objects[e]
    }
    var t = this.idx;
    do {
        t = (t + 1) % this.size;
        var r = this.objects[t];
        if (!r.active)
            return this.idx = t,
                this.numActive++,
                r.active = !0,
                r
    } while (t != this.idx); return this.expand(this.originalSize),
        log("Expanding pool for: " + this.objects[0].constructor.name + " to: " + this.size),
        this.retrieve()
}
ut.prototype.recycle = function (e) {
    e.active = !1,
        this.numActive--
}
ut.prototype.forEachActive = function (e) {
    for (var t = 0; t < this.size; t++) {
        var r = this.objects[t];
        !0 === r.active && e(r, t)
    }
}

var Vt = {
    buffer: null,
    bufferPool: new ut((function () {
        return new kt(2048)
    }
    ), 2),
    getBuffer: function () {
        var e = this.bufferPool.retrieve();
        return e.idx = 0,
            e
    }
};
function kt(e) {
    this.idx = 0,
        this.arrayBuffer = new ArrayBuffer(e),
        this.buffer = new Uint8Array(this.arrayBuffer, 0, e)
}
kt.prototype.send = function (e) {
    var t = new Uint8Array(this.arrayBuffer, 0, this.idx);
    e.send(t),
        Vt.bufferPool.recycle(this)
}
kt.prototype.packInt8 = function (e) {
    this.buffer[this.idx] = 255 & e,
        this.idx++
}
kt.prototype.packInt16 = function (e) {
    this.buffer[this.idx] = 255 & e,
        this.buffer[this.idx + 1] = e >> 8 & 255,
        this.idx += 2
}
kt.prototype.packInt32 = function (e) {
    this.buffer[this.idx] = 255 & e,
        this.buffer[this.idx + 1] = e >> 8 & 255,
        this.buffer[this.idx + 2] = e >> 16 & 255,
        this.buffer[this.idx + 3] = e >> 24 & 255,
        this.idx += 4
}
kt.prototype.packRadU = function (e) {
    this.packInt16(1e4 * e)
}
kt.prototype.packRad = function (e) {
    this.packInt16(1e4 * (e + Math.PI))
}
kt.prototype.packFloat = function (e) {
    this.packInt16(300 * e)
}
kt.prototype.packDouble = function (e) {
    this.packInt32(1e6 * e)
}
kt.prototype.packString = function (e) {
    this.packInt8(e.length);
    for (var t = 0; t < e.length; t++)
        this.packInt16(e.charCodeAt(t))
}
kt.prototype.packLongString = function (e) {
    this.packInt16(e.length);
    for (var t = 0; t < e.length; t++)
        this.packInt16(e.charCodeAt(t))
}

var Utils = {
    buffer: null,
    idx: 0,
    init: function (e) {
        this.buffer = new Uint8Array(e),
            this.idx = 0
    },
    isMoreDataAvailable: function () {
        return Math.max(0, this.buffer.length - this.idx)
    },
    unPackInt8U: function () {
        var e = this.idx;
        return this.idx++,
            this.buffer[e]
    },
    unPackInt8: function () {
        return (this.unPackInt8U() + 128) % 256 - 128
    },
    unPackInt16U: function () {
        var e = this.idx;
        return this.idx += 2,
            this.buffer[e] + (this.buffer[e + 1] << 8)
    },
    unPackInt32U: function () {
        var e = this.idx;
        return this.idx += 4,
            this.buffer[e] + 256 * this.buffer[e + 1] + 65536 * this.buffer[e + 2] + 16777216 * this.buffer[e + 3]
    },
    unPackInt16: function () {
        return (this.unPackInt16U() + 32768) % 65536 - 32768
    },
    unPackInt32: function () {
        return (this.unPackInt32U() + 2147483648) % 4294967296 - 2147483648
    },
    unPackRadU: function () {
        return this.unPackInt16U() / 1e4
    },
    unPackRad: function () {
        return this.unPackRadU() - Math.PI
    },
    unPackFloat: function () {
        return this.unPackInt16() / 300
    },
    unPackDouble: function () {
        return this.unPackInt32() / 1e6
    },
    unPackString: function (e) {
        e = e || 1e3;
        var t = Math.min(this.unPackInt8U(), e);
        if (!(this.isMoreDataAvailable() < t)) {
            for (var r = new String, i = 0; i < t; i++) {
                var n = this.unPackInt16U();
                n > 0 && (r += String.fromCharCode(n))
            }
            return r
        }
    }
}

function handleData(Data, ws) {
    Utils.init(Data)
    //Get the Command
    var cmd = Utils.unPackInt8U()
    if (cmd == 3) {
        //Get the Chat Message
        var Message = Utils.unPackString()
        log("Sent Chat: " + Message);
        //Chat
        Server.clients.forEach((client) => {
            if (client != ws) {
                let sendData = Vt.getBuffer()
                sendData.packInt8(3)
                sendData.packInt8(69)
                sendData.packString(Message)
                sendData.send(client)
            }
        })
    }
    else if (cmd == 12) {
        log("Spawn Item")
        //Spawn Item
        let sendData = Vt.getBuffer()
        sendData.packInt8(12)
        sendData.packInt16(1)
        sendData.packInt8(1)
        sendData.packFloat(3.0) //X?
        sendData.packFloat(3.0) //Y?
        sendData.packFloat(19.0) //Z?
        sendData.send(ws)
    }
    else if (cmd == 14) {
        //Swap Weapon
        ws.SlotIdx = Utils.unPackInt8U();
        log(ws.PlayerName + " Swapped Weapon to " + (ws.SlotIdx == 0 ? "Primary" : "Secondary"));
    }
    else if (cmd == 15) {
        log("Join Game Requested...")
        Utils.unPackInt8U();
        Utils.unPackInt8U();
        var GameType = Utils.unPackInt8U();
        var MapIdx = Utils.unPackInt8U();
        Utils.unPackInt16U();
        Utils.unPackInt32U();
        ws.ClassIdx = Utils.unPackInt8U();
        ws.P_WID = Utils.unPackInt8U();
        ws.S_WID = Utils.unPackInt8U();
        ws.Color = Utils.unPackInt8U();
        ws.Hat = Utils.unPackInt8U();
        ws.Stamp = Utils.unPackInt8U();
        ws.Grenade = Utils.unPackInt8U();
        ws.PlayerName = Utils.unPackString();
        ws.WeaponIdx = 0; //Primary Weapon
        log("Player with Name: " + ws.PlayerName + " has Joined.")
        //Accept Join Game Req
        let sendData2 = Vt.getBuffer();
        sendData2.packInt8(0); //Tell the client to join the game
        sendData2.packInt8(1); //Player ID ;)
        sendData2.packInt8(1); // Team
        sendData2.packInt8(GameType); // GameType
        sendData2.packInt16(1); //Idk
        sendData2.packInt32(1); // Idk2
        sendData2.packInt8(2); // Map (Defaults to Blender)
        sendData2.packInt8(10); //Max Players/Player Limit
        sendData2.packInt8(1); //Is owner
        sendData2.send(ws);
    }
    else if (cmd == 16) {
        //log("Ping...")
        //Ping
        let sendData = Vt.getBuffer()
        sendData.packInt8(16); //Send a message back
        sendData.send(ws);
        //log("Pong!")
    }
    else if (cmd == 18) {
        log("Adding Player...")
        Server.clients.forEach((client) => {
            let sendData = Vt.getBuffer()
            sendData.packInt8(1) //Command
            sendData.packInt8(1) //Player Id
            sendData.packInt16(1); //uniqueId
            sendData.packString("[SS-GS] " + ws.PlayerName) //New Player Name
            sendData.packInt8(ws.ClassIdx) //Class?
            sendData.packInt8(1) //Team
            sendData.packInt8(ws.P_WID)// Weapon Id
            sendData.packInt8(ws.S_WID) //Secondary Weapon Id
            sendData.packInt8(ws.Color) //Shell Color?
            sendData.packInt8(ws.Hat) //Hat
            sendData.packInt8(ws.Stamp) //Stamp
            sendData.packInt8(ws.Grenade) //Grenade
            sendData.packFloat(3.0) //X Loc
            sendData.packFloat(3.0) //Y Loc
            sendData.packFloat(19.0) //Z Loc
            sendData.packFloat(3.0) //X Loc
            sendData.packFloat(3.0) //Y Loc
            sendData.packFloat(19.0) //Z Loc
            sendData.packRad(0) //Yaw Rot
            sendData.packRad(0) //Pitch Rot
            sendData.packInt32(1) //Score
            sendData.packInt16(1) //Kills
            sendData.packInt16(1) //Deaths
            sendData.packInt16(0) //Streak
            sendData.packInt32(3) //Total Kills
            sendData.packInt32(1) //Total Deaths
            sendData.packInt16(0) //Best Game Streak?
            sendData.packInt16(0) //Best Overall Streak?
            sendData.packInt8(0) //Shield
            sendData.packInt8(100) //Health
            sendData.packInt8(1) //Playing
            sendData.packInt8(1) //Weapon Index
            sendData.packInt8(1) //Control Keys?
            sendData.packInt8(1) //Upgrade Id?
            //Line below causes the client to crash
            //sendData.packInt8(0) // Active Shell Streaks?
            sendData.packLongString("{'active': false'}") //Social?
            sendData.send(client);
        })
        //Client Ready
        let sendData3 = Vt.getBuffer()
        sendData3.packInt8(18)
        sendData3.send(ws);
    }
    else if (cmd == 19) {
        log("Requested Respawn...")
        //Request Respawn
        let sendData = Vt.getBuffer()
        sendData.packInt8(13)
        sendData.packInt8(1)
        sendData.packInt16(1) //Speed (Idk what this does)
        //These coords dont seem to apply.
        sendData.packFloat(3.0) //X
        sendData.packFloat(3.0) //Y
        sendData.packFloat(19.0) //Z
        sendData.packInt8(GetMaxRounds(ws.ClassIdx)) //Loaded Ammo
        sendData.packInt8(GetMaxAmmo(ws.ClassIdx)) //Ammo
        sendData.packInt8(15) //Secondary Loaded Ammo
        sendData.packInt8(60) //Secondary Ammo
        sendData.packInt8(0) //Grenades (Doesnt work)
        sendData.send(ws);
    }
    else if (cmd == 24) {
        ws.ClassIdx = Utils.unPackInt8U()
        log(ws.PlayerName + " Switched Weapon Class to: " + GetWeaponClassName(ws.ClassIdx));
    }
    else if (cmd == 26) {
        //Pause
        //Kill the Player
        let sendData = Vt.getBuffer();
        sendData.packInt8(1) //idk
        sendData.packInt8(1) //Id?
        sendData.packInt8(3) //Respawn time
        sendData.send(ws)
    }
    else if (cmd == 29) {
        //Reload
        let sendData = Vt.getBuffer();
        sendData.packInt8(29);
        sendData.packInt8(1);
        sendData.send(ws);
    }
    else if (cmd == 30) {
        //Refresh Game State?
    }
    else if (cmd == 33) {
        //Kick Player
        log("Nice Try...")
    }
    else if (cmd == 38) {
        //Ban? Ignore ig
    }
    else if (cmd == 47) {
        //Reload
        let sendData = Vt.getBuffer();
        sendData.packInt8(29);
        sendData.packInt8(1);
        sendData.send(ws);
    }
    else {
        log("Command: " + cmd)
    }
}

Server.on("connection", ws => {
    log("New Connection!")
    ws.on("close", async (lol) => {
        log("Lost Connection...")
    })

    ws.on("message", async (data) => {
        //log("Got Message: " + data);
        handleData(data, ws);
    });
})