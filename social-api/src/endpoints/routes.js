const swaggerMerge = require('swagger-merge')
const swagger = require('swagger-tools')
const path = require('path')
const fs = require('fs')
const normalizedPath = path.join(__dirname, '')

const specs = []
let controllers = []

const init = async ({ postsService, feedsService }) => {
  fs.readdirSync(normalizedPath).map(file => {
    if (file === 'routes.js') return
    specs.push(require(`./${file}/${file}.swagger`))
    controllers.push(require(`./${file}/${file}.controller`))
  })

  controllers = controllers.reduce(
    (apis, curr) => Object.assign(apis, curr.init({ postsService, feedsService })),
    {}
  )

  const info = {
    version: '0.0.1',
    title: 'merged swaggers',
    description: 'All swaggers are merged together'
  }
  const schemes = ['http']
  const swaggerSpecs = swaggerMerge.merge(specs, info, '/api/v1', 'localhost', schemes)
  const swaggerRoutes = await new Promise((resolve, reject) =>
    swagger.initializeMiddleware(swaggerSpecs, mw =>
      mw instanceof Error ? reject(mw) : resolve(mw)
    )
  )

  return { swaggerRoutes, controllers }
}

module.exports = { init }
