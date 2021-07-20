const amqplib = require('amqplib')

async function queueService () {
  const conn = await amqplib.connect('amqp://rabbitmq:5672')
  const channel = await conn.createChannel()

  async function addToQueue (post) {
    await channel.sendToQueue('postDiagnose', Buffer.from(JSON.stringify(post), 'utf8'))
  }

  return { addToQueue }
}

module.exports = queueService
