const D = require('discord.js')
const cli = new D.Client()
const encryptionKey = 'CHUNICHUNICHUNIC'
const cryptoMethod = 'aes-128-ecb'
const { createDecipheriv, createCipheriv } = require('crypto')

function decrypt (data) {
  const encrypted = Buffer.from(data, 'hex')
  const decipher = createDecipheriv(cryptoMethod, encryptionKey, '')
  decipher.setAutoPadding(false)
  let result = decipher.update(encrypted).toString('hex')
  result += decipher.final().toString('hex')
  return result
}

function encrypt (data) {
  const chipher = createCipheriv(cryptoMethod, encryptionKey, '') // Iv default value
  chipher.setAutoPadding(false)
  let result = chipher.update(data).toString('hex')
  result += chipher.final().toString('hex')
  return result
}

const prefix = '>'
cli.on('message', async (m) => {
  const args = m.content.split(/ +/)
  const command = args.shift().slice(prefix.length)
  if (!m.content.startsWith(prefix)) return
  if (command === 'decrypt') {
    const content = args.join(' ')
    const base = `Decrypt method: ${cryptoMethod.toUpperCase()}\nEncryption Key: ${encryptionKey}\n`
    try {
      const decrypted = decrypt(content)
      await m.channel.send(`${base}Result: ${decrypted}`)
    } catch (e) {
      await m.channel.send(`Decrypt failed\n${base}${e.message || e}`)
    }
  }
  if (command === 'encrypt') {
    const content = args.join(' ')
    const base = `Encrypt method: ${cryptoMethod.toUpperCase()}\nEncryption Key: ${encryptionKey}\n`
    try {
      const encrypted = encrypt(Buffer.from(content))
      await m.channel.send(`${base}Result: ${encrypted}`)
    } catch (e) {
      await m.channel.send(`Encrypt failed\n${base}${e.message || e}`)
    }
  }
})

cli.login('Token')
