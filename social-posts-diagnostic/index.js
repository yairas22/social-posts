const amqplib = require('amqplib')
const Watchlist = require('./src/services/watchlist')
const mysqlClient = require('./src/utils/mysql')

async function start() {
  try {
    await mysqlClient.connect({
      host: process.env.MYSQL_SERVER,
      port: process.env.MYSQL_PORT,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      db: process.env.MYSQL_DATABASE
    })
    const watchlistWords = process.env.WATCHLIST_WORDS
    const watchlist = new Watchlist(watchlistWords)
    const conn = await amqplib.connect('amqp://rabbitmq:5672')
    const channel = await conn.createChannel()
    await channel.assertQueue('postDiagnose')

    await channel.consume('postDiagnose', msg => {
      if (msg !== null) {
        console.log(`Received new post:`, msg.content.toString())
        const item = JSON.parse(msg.content.toString())
        if (watchlist.foundProblematicWord(item)) {
          console.log('YES')
        }
        channel.ack(msg)
      }
    })
  } catch (err) {
    console.log(`Error receiving post`, err)
  }
}

start()
