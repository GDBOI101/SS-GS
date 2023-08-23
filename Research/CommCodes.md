# CommCodes
Codes used to Identify the Command sent to/from the Server.
<br>
This doc is not complete.
# Codes
gameJoined: 0 (Called when a client joins the Game)
<br>
addPlayer: 1 (Called when a Player is ready to be added)
<br>
removePlayer: 2 (I'm assuming this is called when a player is supposed to be removed)
<br>
chat: 3 (Called when a chat message is sent)
<br>
controlKeys: 4 (Unknown)
<br>
keyUp: 5 (Most likely sent to the server after a client presses a key)
<br>
syncThem: 6 (Unknown)
<br>
syncAmmo: 7 (Unknown)
<br>
die: 8 (Called when a Player dies?)
<br>
hitThem: 9 (Most likely sent when a shot hits another player)
<br>
hitMe: 10 (Most likely sent to the client that was shot when the server receives hitThem)
<br>
collectItem: 11 (Unknown)
<br>
spawnItem: 12 (Possibly Spawn a Weapon?)
<br>
respawn: 13 (Sent to notify the client of a respawn)
<br>
swapWeapon: 14 (Swap a weapon? Not sure if this is sent from the Client or the Server)
<br>
joinGame: 15 (Most likely sent to let the client know it can join)
<br>
ping: 16 (Sent from the Client to ask the Server to reply with Pong)
<br>
pong: 17 (Server's response to a ping request)
<br>
clientReady: 18 (Most likely notifies the client that its ready or sent from the Server to notify the client its ready. Idk)
<br>
requestRespawn: 19 (Sent to the Server to request a Respawn)
<br>
joinPublicGame: 20 (Unknown)
<br>
joinPrivateGame: 21 (Unkown)
<br>
createPrivateGame: 22 (Unknown)
<br>
switchTeam: 23 (Most likely sent from the Client to ask the Server to change teams)
<br>
changeCharacter: 24 (Unknown)
<br>
playerCount: 25 (Most likely a client request to ask for the Player Count)
<br>
pause: 26 (Unknown)
<br>
announcement: 27 (Sends a request to the Client asking to Update the Announcement Text)
<br>
updateBalance: 28 (Unknown)
<br>
reload: 29 (Most likely sends a server request to reload)
<br>
refreshGameState: 30 (Unknown)
<br>
switchTeamFail: 31 (Most likely sent to the Client when a team switch request fails)
<br>
expireUpgrade: 32 (Unknown)
<br>
bootPlayer: 33 (Sends a request from the Client that tells the Server to Kick a Player)
<br>
loginRequired: 34 (Unknown)
<br>
banned: 35 (Some sort of Ban Message sent from the Server)
<br>
gameLocked: 36 (Unknown)
<br>
metaGameState: 39 (Unknown)
<br>
syncMe: 40 (Unknown)
<br>
explode: 41 (Most likely triggers an explosion effect for the Player Death)
<br>
keepAlive: 42 (Unknown)
<br>
musicInfo: 43 (Unknown)
<br>
hitMeHardBoiled: 44 (Something to do with the Hard Boiled buff)
<Br>
beginShellStreak: 45 (Starts a shell streak)
<br>
endShellStreak: 46 (Ends a shell streak)
<br>
startReload: 47 (Starts reloading)
<br>
fire: 48 (Most likely a message to shoot a weapon)
<br>
throwGrenade: 49 (Most likely Sends a request to the server to throw a grenade)
<br>
info: 50 (Unknown)
<br>
videoReward: 51 (Most likely plays an ad and/or grants the reward for doing so)
<br>
eventModifier: 52 (Unknown)

# Comm Code Info
Documentation on the Received or Sent Data Types and Order

# Client

# Server
