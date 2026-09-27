const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require("@whiskeysockets/baileys")
const readline = require("readline")
async function startBot(){
const { state, saveCreds } = await useMultiFileAuthState('session')
const sock = makeWASocket({ auth: state, browser: ["Gojo-Pay","Chrome","1.0"] })
sock.ev.on('creds.update', saveCreds)
sock.ev.on('connection.update', async (up) => {
const { connection, lastDisconnect } = up
if(connection === 'open') console.log('GOJO PAY ONLINE 🌊 delover by man 🌊')
if(connection === 'close'){
if(lastDisconnect?.error?.output?.statusCode!==DisconnectReason.loggedOut) startBot()
}
})
if(!state.creds.registered){
const rl = readline.createInterface({input: process.stdin, output: process.stdout})
rl.question('Nomor 628xxx: ', async (nomor) => {
console.log('CODE:',await sock.requestPairingCode(nomor))
rl.close()
})
}
sock.ev.on('messages.upsert', async (m) => {
const msg = m.messages[0]
if(!msg.message || msg.key.fromMe) return
const from = msg.key.remoteJid
const text = (msg.message.conversation||msg.message.extendedTextMessage?.text||"").toLowerCase().trim()
if(text=='.start'||text=='.menu'){
await sock.sendMessage(from,{video:{url:"https://media.tenor.com/2uyENRuvV-0AAAAC/gojo-satoru-gojo.gif"},gifPlayback:true,caption:`*GOJO PAY BOT AKTIF* 🌊\n\n• Diamond Nokos\n• Jasa Upgrade Premium 70K\nAman Lovable\n\nCommand:.start.ping.gojo\n\n🌊 delover by man 🌊`})
}
if(text=='.ping') await sock.sendMessage(from,{text:'Pong! Online 🏓\n🌊 delover by man'})
if(text=='.gojo') await sock.sendMessage(from,{text:'Owner Gojo Pay 🌊 delover by man 🌊'})
})
}
startBot()
