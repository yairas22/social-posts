const amqplib = require('amqplib')

class QueueService {
  async initializeQueue () {
    const conn = await amqplib.connect('amqp://rabbitmq:5672')
    this.channel = await conn.createChannel()
    await this.channel.assertQueue('postDiagnose')
  }

  getChannel () {
    return this.channel
  }
}

module.exports = QueueService
