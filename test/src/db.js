const Mysql = require('mysql')
const util = require('util')
let mysql, query

async function initDB() {
  await connectMysql()
}

async function connectMysql () {
  mysql = await Mysql.createPool({
    host: process.env.MYSQL_SERVER,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD
  })

  mysql.on('connection', (connection) => 
    {
      mysql = connection
    }
  )
}

async function mysqlExecute (sql, values = []) {
  query = util.promisify(mysql.query).bind(mysql)
  return await query(sql, values)
}

async function addTestUser({ userId, email, role, imageUrl, country }) {
  try {
    await mysqlExecute(
      `INSERT INTO feeds.users SET id = ?, email = ?, role_id = ?, imageUrl = ?, country_id = ?`,
      [userId, email, role, imageUrl, country]
    )
  } catch { }
}

module.exports = { initDB, addTestUser, mysqlExecute }
