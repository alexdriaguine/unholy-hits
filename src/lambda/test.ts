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
    return callback(null, {
      statusCode: 200,
      body: 'try posting me'
    })
  }
  const token = process.env['SLACK_TOKEN'] || ''

  const web = new WebClient(token)

  const {text, channel_id} = querystring.parse(event.body) as {
    text: string
    channel_id: string
  }

  web.chat
    .postMessage({
      token,
      text: `${text} :church: :fire: (I AM NOW SERVERLESS <@oscar>)`,
      icon_emoji: ':church:',
      channel: channel_id,
    })
    .then(() => {
      callback(null, {
        statusCode: 200,
        body: 'Hello, world!',
      })
    })
    .catch(err => callback(err))
}
