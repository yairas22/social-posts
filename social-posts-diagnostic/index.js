const Watchlist = require('./src/services/watchlist')
const MailSender = require('./src/services/mailSender')
const QueueService = require('./src/services/queue')
const UsersModel = require('./src/models/users')
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
    const usersModel = new UsersModel(mysqlClient)
    const mailSender = new MailSender()
    const queue = new QueueService()
    await queue.initializeQueue()
    let emails = await usersModel.getUsersEmailsByRoles(['MODERATOR', 'SUPER MODERATOR'])

    await queue.getChannel().consume('postDiagnose', async msg => {
      if (msg !== null) {
        const item = JSON.parse(msg.content.toString())
        console.log(`Received new post:`, item.title)
        if (watchlist.foundProblematicWord(item)) {
          mailSender.sendEmails(emails, 'post watchlist alert', msg.content.toString())
        }
        queue.getChannel().ack(msg)
      }
    })
    setInterval(async () => { 
      emails =  await usersModel.getUsersEmailsByRoles(['MODERATOR', 'SUPER MODERATOR'])
      console.log('Emails list updated')
    }, 1000 * 60)
  } catch (err) {
    console.log(`Error receiving post`, err)
  }
}

start()
