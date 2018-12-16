require('dotenv').config()
import * as Hapi from 'hapi'
import {commandRoutes} from './commands/index'
import {spotifyAuthPlugin} from './spotify/auth'
import {eventRoutes} from './events'
import * as db from './db'

const server = new Hapi.Server({
  host: 'localhost',
  port: 8000,
  debug: {request: ['error']},
  routes: {
    cors: true,
  },
})

async function start() {
  server.route(commandRoutes)
  server.route(eventRoutes)
  server.register(spotifyAuthPlugin)

  try {
    await db.connect()
    await server.start()
    console.log(`Server runnint at: ${server.info.uri}`)
  } catch (err) {
    console.error(`Error starting server: ${err}`)
    process.exit(0)
  }
}

start()
