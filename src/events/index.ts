import * as Hapi from 'hapi'
import {onMessage} from './on-message'
import {MessageEvent, EventTypes} from './event'

export const eventRoutes: Hapi.ServerRoute[] = [
  {
    method: 'POST',
    path: '/event',
    handler: request => {
      const {event, type, challenge} = request.payload as {
        event: MessageEvent
        type: string
        challenge: string
      }

      if (type === EventTypes.UrlVerification) {
        return {challenge}
      }

      if (
        event.type === EventTypes.Message &&
        !event.subtype &&
        event.text.includes('https://open.spotify.com')
      ) {
        return onMessage(event)
      }

      return {status: 'No action found'}
    },
  },
]
