require('dotenv').config()

import {WebClient} from '@slack/client'
import * as Hapi from 'hapi'
import {request} from 'https'
const token = process.env['SLACK_TOKEN'] || ''

if (token.length === 0) {
  console.error('No slack token found in .env, exiting')
  process.exit(0)
}

function json(
  h: Hapi.ResponseToolkit,
  value: Hapi.ResponseValue,
): Hapi.ResponseObject {
  const response = h.response(value)
  response.type('application/json')
  return response
}

async function start() {
  const web = new WebClient(token)

  const channelID = 'CEL5Z27T7'
  const server = new Hapi.Server({
    debug: {request: ['error']},
    port: 8000,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  })

  server.route([
    {
      path: '/',
      method: 'GET',
      handler: (_, h) => {
        return json(h, {
          status: 'OK',
          description: 'Api for the Unholy Hits slack bot',
        })
      },
    },
    {
      path: '/test',
      method: 'POST',
      handler: (request, h) => {
        const {text, trigger_id, channel_id} = request.payload as any
        web.chat.postMessage({
          token,
          text: `${text} :church: :fire:`,
          icon_emoji: ':church:',
          channel: channel_id,
        })
        return h.response()
      },
    },
    {
      path: '/event',
      method: 'POST',
      handler: (request, h) => {
        console.log(request.payload)
        return json(h, {challenge: (request.payload as any).challenge})
      },
    },
  ])

  server
    .start()
    .then(() => {
      console.log(`Server running at ${server.info.uri}`)
    })
    .catch(err => {
      console.log(`Error starting server: `, err.message)
      process.exit(0)
    })
}

start()
