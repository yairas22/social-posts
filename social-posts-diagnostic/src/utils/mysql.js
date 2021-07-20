const Mysql = require('mysql')
const util = require('util')
let mysql, query

async function connect ({ host, port, user, password, db }) {
  mysql = await Mysql.createPool({ host, port, user, password })

  mysql.on('connection', (connection) => 
    {
      mysql = connection
      execute(`USE ${db}`)
    }
  )
}

async function execute (sql, values = []) {
  query = util.promisify(mysql.query).bind(mysql)
  return await query(sql, values)
}

module.exports = { connect, execute }
