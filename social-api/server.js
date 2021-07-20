const express = require('express')
const bodyParser = require ('body-parser')
const mysqlClient = require('./src/utils/mysql')
const basicAuth = require('./src/middleware/auth')
const endpoints = require('./src/endpoints/routes')

async function run() {
  console.log(`Initializing Social API`)
  await mysqlClient.connect({
    host: process.env.MYSQL_SERVER,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    db: process.env.MYSQL_DATABASE
  })

  const postsModel = require('./src/models/posts')(mysqlClient)
  const usersModel = require('./src/models/users')(mysqlClient)
  const queueService = await require('./src/services/queue')()
  const postsService = require('./src/services/posts')({ postsModel, queueService })
  const feedsService = require('./src/services/feeds')({ postsModel, usersModel })
  const app = express()

  const { swaggerRoutes, controllers } = await endpoints.init({ postsService, feedsService })

  app.use(bodyParser.json())

  app.use('/api/v1/', [ basicAuth ])

  const compression = require('compression')
  app.use(compression())

  app.use(swaggerRoutes.swaggerMetadata())
  app.use(swaggerRoutes.swaggerUi({ apiDocs: '/v1/api-docs', swaggerUi: '/v1/docs' }))
  app.use(swaggerRoutes.swaggerValidator({ validateResponse: false }))
  app.use(swaggerRoutes.swaggerRouter({ useStubs: true, controllers }))

  app.listen(3008, () => {
      console.log(`Server listening on port 3008!`)
  })
}

run()
