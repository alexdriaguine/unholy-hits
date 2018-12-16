import {slackWebClient} from '../slack'
import * as Boom from 'boom'
import {MessageEvent} from './event'

export function onMessage(event: MessageEvent) {
  return slackWebClient.chat
    .postMessage({
      text: `i'm retarded. this is a spotifylink, i should add it to a playlist.`,
      icon_emoji: ':church:',
      channel: event.channel,
    })
    .then(() => ({status: 'ok'}))
    .catch(err => Boom.boomify(err))
}
