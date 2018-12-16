require('dotenv').config()
import * as Hapi from 'hapi'
import {WebClient, WebAPICallError} from '@slack/client'
import * as Boom from 'boom'
import * as Bell from 'bell'
import * as mongoose from 'mongoose'
import {Z_BUF_ERROR} from 'zlib'

// TODO: clean this shit up

// @ts-ignore
mongoose.Promise = global.Promise

interface Token {
  refreshToken: string
  accessToken: string
  accessTokenType: string
}

interface IChannel {
  channel_name: string
  channel_id: string
  spotify_access_token: string
  spotify_refreh_token: string
  spotify_profile: {
    id: string
    username: string
  }
}

interface IChannelModel extends IChannel, mongoose.Document {}

export var channelSchema: mongoose.Schema = new mongoose.Schema({
  name: String,
  tokens: {
    spotify: {
      refreshToken: String,
      accessToken: String,
      accessTokenType: String,
    },
  },
})

const ChannelModel = mongoose.model<IChannelModel>('Channel', channelSchema)

// Create a server with a host and port
const server = new Hapi.Server({
  host: 'localhost',
  port: 8000,
  debug: {request: ['error']},
  routes: {
    cors: true,
  },
})
const token = process.env['SLACK_TOKEN'] || ''
const spotify_client_id = process.env['SPOTIFY_CLIENT_ID'] || ''
const spotify_secret = process.env['SPOTIFY_CLIENT_SECRET'] || ''
const slack = new WebClient(token)

// Add the route
server.route([
  {
    method: 'POST',
    path: '/event',
    handler: (request, h) => {
      console.log('hitting /event')
      const {event, type} = request.payload as any // todo typings for this

      if (type === 'url_verification') {
        return h.response({challenge: event.ch}).type('application/json')
      }

      if (event.type === 'message' && !event.subtype) {
        return slack.chat
          .postMessage({
            token,
            text: `i'm retarded. this is a spotifylink, i should add it to a playlist.`,
            icon_emoji: ':church:',
            channel: event.channel,
          })
          .then(() => {
            return {status: 'ok'}
          })
          .catch(err => {
            return Boom.internal('error')
          })
      }

      return h.response().type('application/json')
    },
  },
  {
    method: 'POST',
    path: '/setup',
    handler: (request, h) => {
      return {status: 'okhaha'}
    },
  },
])

// Start the server
async function start() {
  try {
    await server.register(require('bell'))
    server.auth.strategy('spotify', 'bell', {
      provider: 'spotify',
      clientId: spotify_client_id,
      clientSecret: spotify_secret,
      password:
        'dude-generate-this-shit-later-with-something-byt-for-now-this-is-enought-localhost-shizzle',
      location: 'http://localhost:8000',
      isSecure: false,
      scope: ['user-read-email'],
    })
    server.route({
      method: ['GET', 'POST'],
      path: '/spotify/callback',
      options: {
        auth: 'spotify',
        handler: (request, h) => {
          console.log(request.auth)
          return request.auth
        },
      },
    })
    await mongoose.connect(
      'mongodb://localhost:27017/unholy-hits',
      {
        useNewUrlParser: true,
      },
    )

    await server.start()
  } catch (err) {
    console.log(err)
    process.exit(1)
  }

  console.log('Server running at:', server.info.uri)
}

start()
