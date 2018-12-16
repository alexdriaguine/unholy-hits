import * as Hapi from 'hapi'
import {slackWebClient} from '../slack'
import * as Boom from 'boom'
import {ChannelModel} from '../db/channel'

export const setupCommandRoute: Hapi.ServerRoute = {
  method: 'POST',
  path: '/setup',
  handler: async (request, h) => {
    const {channel_id, channel_name} = request.payload as {
      channel_id: string
      channel_name: string
    }
    const existingChannel = await ChannelModel.findOne({
      channelName: channel_name,
      channelId: channel_id,
    })


    if (existingChannel) {
      return slackWebClient.chat
        .postMessage({
          text: `Channel ${channel_name} already has a master.`,
          channel: channel_id,
        })
        .then(() => ({status: 'OK'}))
    }

    return slackWebClient.chat
      .postMessage({
        text: `<https://unholy.localtunnel.me/spotify/callback?channelId=${channel_id}&channelName=${channel_name}>`,
        channel: channel_id,
      })
      .then(res => ({status: 'OK'}))
      .catch(Boom.boomify)
  },
}
