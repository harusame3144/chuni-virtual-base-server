const crypto = require('crypto')
function decrypt (data) {
  const encrypted = Buffer.from(data, 'hex')
  const decipher = crypto.createDecipheriv('aes-128-ecb', 'CHUNICHUNICHUNIC', '')
  decipher.setAutoPadding(false)
  let result = decipher.update(encrypted).toString('hex')
  result += decipher.final().toString('hex')
  return result
}

// console.log(hostData)

const dgram = require('dgram')
const sok = dgram.createSocket({ type: 'udp4', reuseAddr: true })

sok.on('message', (msg) => {
  const asdf = msg.toString('hex').slice(8)
  console.log('50001 - ' + decrypt(asdf))
})

sok.bind(50001)

const sokk = dgram.createSocket({ type: 'udp4', reuseAddr: true })

sokk.on('message', (msg) => {
  const asdf = msg.toString('hex').slice(8)
  console.log('50003 - ' + decrypt(asdf))
})

sokk.bind(50003)
