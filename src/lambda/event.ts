require('dotenv').config()

import {Handler} from 'aws-lambda'
import {WebClient} from '@slack/client'
import * as querystring from 'querystring'

interface SlackCommandEvent {
  path: string
  httpMethod: string
  queryStringParameters: {[key: string]: string}
  headers: {[key: string]: string}
  body: string
  isBase64Encoded: boolean
}

export const handler: Handler<SlackCommandEvent> = (
  event,
  context,
  callback,
) => {
  if (event.httpMethod === 'GET') {
    console.log('Something GET')
    return callback(null, {statusCode: 404, body: ''})
  }
  let parsed
  try {
    parsed = JSON.parse(event.body)
  } catch (err) {
    return callback(err)
  }

  if (parsed.type === 'url_verification') {
    console.log('URL Verification')
    return callback(null, {
      statusCode: 200,
      body: JSON.stringify({challenge: parsed.challenge}),
    })
  }

  console.log('SLACK BOT ACTION??', parsed)

  const {type, text, channel, user, subtype} = parsed.event

  // Only react to the original message
  if (type === 'message' && !subtype && text.includes('spotify')) {
    const token = process.env['SLACK_TOKEN'] || ''

    const web = new WebClient(token)


    return web.chat
      .postMessage({
        token,
        text: `i'm retarded. this is a spotifylink, i should add it to a playlist.`,
        icon_emoji: ':church:',
        channel,
      })
      .then(() => {
        return callback(null, {
          statusCode: 200,
          body: 'Hello, world!',
        })
      })
      .catch(err => callback(err))
    return callback(null, {statusCode: 200, body: ''})
  }

  return callback(null, {
    statusCode: 200,
    body: '',
  })
}
