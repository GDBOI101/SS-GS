const WSS = require("ws").Server;
const PORT = process.env.PORT || 80;

var PlayerCount = 0;

let ut = function(e, t) {
    this.size = 0,
    this.originalSize = t,
    this.constructorFn = e,
    this.objects = [],
    this.idx = 0,
    this.numActive = 0,
    this.expand(t)
}
ut.prototype.expand = function(e) {
    for (var t = 0; t < e; t++) {
        var r = this.constructorFn();
        r.id = t + this.size,
        r.active = !1,
        this.objects.push(r)
    }
    this.size += e
}
ut.prototype.retrieve = function(e) {
    if (null != e) {
        for (; e >= this.size; )
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
    } while (t != this.idx);return this.expand(this.originalSize),
    console.log("Expanding pool for: " + this.objects[0].constructor.name + " to: " + this.size),
    this.retrieve()
}
ut.prototype.recycle = function(e) {
    e.active = !1,
    this.numActive--
}
ut.prototype.forEachActive = function(e) {
    for (var t = 0; t < this.size; t++) {
        var r = this.objects[t];
        !0 === r.active && e(r, t)
    }
}

var Vt = {
    buffer: null,
    bufferPool: new ut((function() {
        return new kt(2048)
    }
    ),2),
    getBuffer: function() {
        var e = this.bufferPool.retrieve();
        return e.idx = 0,
        e
    }
};
function kt(e) {
    this.idx = 0,
    this.arrayBuffer = new ArrayBuffer(e),
    this.buffer = new Uint8Array(this.arrayBuffer,0,e)
}
kt.prototype.send = function(e) {
    var t = new Uint8Array(this.arrayBuffer,0,this.idx);
    e.send(t),
    Vt.bufferPool.recycle(this)
}
kt.prototype.packInt8 = function(e) {
    this.buffer[this.idx] = 255 & e,
    this.idx++
}
kt.prototype.packInt16 = function(e) {
    this.buffer[this.idx] = 255 & e,
    this.buffer[this.idx + 1] = e >> 8 & 255,
    this.idx += 2
}
kt.prototype.packInt32 = function(e) {
    this.buffer[this.idx] = 255 & e,
    this.buffer[this.idx + 1] = e >> 8 & 255,
    this.buffer[this.idx + 2] = e >> 16 & 255,
    this.buffer[this.idx + 3] = e >> 24 & 255,
    this.idx += 4
}
kt.prototype.packRadU = function(e) {
    this.packInt16(1e4 * e)
}
kt.prototype.packRad = function(e) {
    this.packInt16(1e4 * (e + Math.PI))
}
kt.prototype.packFloat = function(e) {
    this.packInt16(300 * e)
}
kt.prototype.packDouble = function(e) {
    this.packInt32(1e6 * e)
}
kt.prototype.packString = function(e) {
    this.packInt8(e.length);
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
    var cmd = Utils.unPackInt8U()
    console.log("Command Num: " + cmd);
    if(cmd == 15) { 
        //Join Game Req
        let sendData = Vt.getBuffer()
        sendData.packInt8(0);
        sendData.send(ws);
    }
    if (cmd == 16) { 
        //Ping
        let sendData = Vt.getBuffer()
        sendData.packInt8(16);
        sendData.send(ws);
    }
    if(cmd == 18) {
        //Client Ready
    }
}

var GMsgIndex = 0;

var Server = new WSS({ port: PORT }, () => {
    console.log("Server Started!");
});

Server.on("connection", ws => {
    var PlayerIndex = PlayerCount;
    var MessageIndex = 0;
    console.log("New Connection!")
    ws.on("close", async (lol) => {
        console.log("Lost Connection. Index: " + PlayerIndex)
    })

    ws.on("message", async (data) => {
        console.log("Got Message: " + data);
        handleData(data, ws);
    });
})
