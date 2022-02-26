# Receiving
To decode data do this:
<br>
Utils.init(Data)
<br>
(Data is whatever you get from the websocket)
<br>
<br>
to get the command its calling do this:
<br>
var cmd = Utils.unPackInt8()
<br>
(Do this after init)

# Sending
var sendData = Vt.getBuffer();
<br>
sendData.packInt8(bytes) for packing bytes
<br>
sendData.packInt16(int16) for packing int 16s (idk the difference tbh)
<br>
sendData.packInt32(int) for packing normal ints (again idk if int32 and int16 are different)
<br>
sendData.packFloat(float) for packing floats
<br>
sendData.packString(string) for packing strings
<br>
sendData.send(ws) ws is the websocket client