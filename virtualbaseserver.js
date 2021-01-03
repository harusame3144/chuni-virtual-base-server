// Fixed umm... improved? version of this https://gist.github.com/esterTion/d03d8f80e497181026f2c1fd73598547
/** Dependencies */
const { ip2long } = require('locutus/php/network')
const { dechex } = require('locutus/php/math/')
const { createCipheriv } = require('crypto')
const { createSocket } = require('dgram')
const { createServer } = require('net')
/** ------------ */

/** Udp Sockets */
const udp1 = createSocket({ type: 'udp4', reuseAddr: true })
const udp2 = createSocket({ type: 'udp4', reuseAddr: true })
/** ------------------------- */

/** Constants */
const { tcpListenIp, hostIp, broadCastIp, broadCastInterval } = require('./config')
const { udp1Port, udp2Port, tcp1Port } = { udp1Port: 50001, udp2Port: 50003, tcp1Port: 50001 }
const encryptionKey = 'CHUNICHUNICHUNIC'
console.log(`Configs\ntcpListenIp: ${tcpListenIp} hostIp: ${hostIp}\nbroadCastIp ${broadCastIp} broadCastInterval ${broadCastInterval} (broadcast between ${broadCastInterval / 1000} seconds)`)
/** -------- */

/** Flags */
let udp1Rdy = false
let udp2Rdy = false
let isRdy = false
/** ----- */

// data = buffer
function encrypt (data) {
  const chipher = createCipheriv('aes-128-ecb', encryptionKey, '') // Iv default value
  chipher.setAutoPadding(false)
  let result = chipher.update(data).toString('hex')
  result += chipher.final().toString('hex')
  return result
}

const startInterval = () => {
  if (!(udp1Rdy && udp2Rdy) || isRdy) return
  else isRdy = true
  setInterval(() => {
    const baseServerInfoData =
      'f8ca0f00ffca0f001b00000016000000' +
      '73657269616c697a6174696f6e3a3a61' +
      '7263686976650a000404040801000000' +
      `0000000000${dechex(ip2long(hostIp))}00000000000000`

    const hostInfoData =
      'f8ca0f00ffca0f001500000016000000' +
      '73657269616c697a6174696f6e3a3a61' +
      '7263686976650a000404040801000000' +
      `0000000000${dechex(ip2long(hostIp))}01000000000000` // Hex, before encryption

    const encryptedHostData = encrypt(Buffer.from(hostInfoData, 'hex'))
    const baseHostData = Buffer.from('44000000' + encryptedHostData, 'hex')
    const encryptedBaseServerData = encrypt(Buffer.from(baseServerInfoData, 'hex'))
    const baseServerData = Buffer.from('44000000' + encryptedBaseServerData, 'hex')
    udp1.send(baseHostData, udp1Port, broadCastIp, (err, bytes) => {
      if (err) return console.error(err)
      console.log(`${new Date().getTime()} Broadcast ${broadCastIp}:${udp1Port} to ${bytes} bytes`)
    })
    udp2.send(baseServerData, udp2Port, broadCastIp, (err, bytes) => {
      if (err) return console.error(err)
      console.log(`${new Date().getTime()} Broadcast ${broadCastIp}:${udp2Port} to ${bytes} bytes`)
    })
  }, broadCastInterval)
}

// Socket bind
udp1.bind(udp1Port, () => {
  udp1.setBroadcast(true)
  console.log(`UDP1 Broadcast true ${udp1.address().address}:${udp1.address().port}`)
})
udp1.on('listening', () => {
  console.log(`UDP1 Listening on ${udp1.address().address}:${udp1.address().port}`)
  udp1Rdy = true
  startInterval()
})

udp2.bind(udp2Port, () => {
  udp2.setBroadcast(true)
  console.log(`UDP2 Broadcast true ${udp1.address().address}:${udp1.address().port}`)
})
udp2.on('listening', () => {
  console.log(`UDP2 Listening on ${udp2.address().address}:${udp2.address().port}`)
  udp2Rdy = true
  startInterval()
})

const HEARTBEAT_END =
  '3a22893b63848f524c573a36c332cd13' +
  'abd15c2cc7116470806e453161615b64' +
  'ab6de1cf'

const HEARTBEAT_TYPE_1 =
  Buffer.from(
    '44000000f979f532aaba84ad950fbf20' +
    '9d704b015b4cfdf896d4387542d65ebc' +
    HEARTBEAT_END, 'hex'
  )

const HEARTBEAT_TYPE_2 =
  Buffer.from(
    '44000000cdd0f0362aa8cbd901f53586' +
    '32cafcbe5b4cfdf896d4387542d65ebc' +
    HEARTBEAT_END, 'hex'
  )

const SETTINGS_SYNC_DATA =
  Buffer.from(
    '54000000176203cd06724e495788252a' +
    '5b65225c5b4cfdf896d4387542d65ebc' +
    '3a22893b63848f524c573a36c332cd13' +
    'abd15c2ce7cf117aedc8ce73d7b63485' +
    '904d30013888815de4e370d21b996d36' +
    '2303352b', 'hex'
  )

const socketNames = {
  '440000008f3c': 'SETTINGS_SYNC',
  '44000000f979': 'HEARTBEAT_TYPE_1',
  '44000000cdd0': 'HEARTBEAT_TYPE_2'
}

const tcp1 = createServer((socket) => {
  socket.on('data', (data) => {
    const op = data.slice(0, 6).toString('hex')
    console.log(`Income data: ${op} ${socketNames[op] || 'None'} IP: ${socket.address().address}:${socket.address().port}`)
    switch (op) {
      case '440000008f3c':
        console.log('Received request sync data, write sync data')
        socket.write(SETTINGS_SYNC_DATA)
        console.log('Write SETTINGS_SYNC_DATA')
        break
      case '44000000f979':
        console.log('Received Heartbeat type 1, write heartbeat type 2')
        socket.write(HEARTBEAT_TYPE_2)
        console.log('Write HEARTBEAT_TYPE_2')
        break
      case '44000000cdd0':
        console.log('Received Heartbeat type 2, write heartbeat type 1')
        socket.write(HEARTBEAT_TYPE_1)
        console.log('Write HEARTBEAT_TYPE_1')
        break
    }
  })
})

tcp1.on('listening', () => {
  console.log(`TCP1 Listening on ${tcp1.address().address}:${tcp1.address().port}`)
})

tcp1.listen(tcp1Port, tcpListenIp)

/** Decrypt UDP Broadcast
 # After 44000000
 const encrypted = Buffer.from('47617679ae3fe5bb38de9b57908843d25b4cfdf896d4387542d65ebc3a22893b63848f524c573a36c332cd13abd15c2cc66a3e8121ee59e769cda74490d17eb2', 'hex')
 const decipher = crypto.createDecipheriv('aes-128-ecb', 'CHUNICHUNICHUNIC', '')
 decipher.setAutoPadding(false)
 let result = decipher.update(encrypted).toString('hex')
 result += decipher.final().toString('hex')
 console.log(result)
 result += decipher.final().toString('ascii')
*/
