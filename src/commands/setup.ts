import * as Hapi from 'hapi'
import {slackWebClient, sendMessage, emojis} from '../slack'
import * as Boom from 'boom'
import {ChannelModel} from '../db/channel'
import {SPOTIFY_REDIRECT_URI} from '../spotify/auth'
import {CommandPayload} from './command-payload'

export const setupCommandRoute: Hapi.ServerRoute = {
  method: 'POST',
  path: '/setup',
  handler: async (request, h) => {
    const {channel_id, channel_name} = request.payload as CommandPayload
    const existingChannel = await ChannelModel.findOne({
      channelName: channel_name,
      channelId: channel_id,
    })

    if (existingChannel) {
      return `Channel ${channel_name} already has a master.`
    }

    return `<${SPOTIFY_REDIRECT_URI}/spotify/callback?channelId=${channel_id}&channelName=${channel_name}>`
  },
}
