import * as Hapi from 'hapi'
import {onMessage} from './on-message'
import {MessageEvent, EventTypes} from './event'
import {ISpotifyWebApi, getSpotifyApi} from '../spotify/client';
import {ChannelModel} from '../db/channel';

export const eventRoutes: Hapi.ServerRoute[] = [
  {
    method: 'POST',
    path: '/event',
    handler: async request => {
      const {event, type, challenge} = request.payload as {
        event: MessageEvent
        type: string
        challenge: string
      }

      if (type === EventTypes.UrlVerification) {
        return {challenge}
      }

      if (event.type === EventTypes.Message && !event.subtype) {
        
        // Grab tokens, set em
        // Check if token is valid also, in that case, refresh
        return onMessage(event)
      }

      return {status: 'No action found'}
    },
  },
]
