import * as Hapi from 'hapi'
import {slackWebClient, sendMessage, emojis, stripLinkTags} from '../slack'
import * as Boom from 'boom'
import {ChannelModel} from '../db/channel'
import {SPOTIFY_REDIRECT_URI} from '../spotify/auth'
import {TextDecoder} from 'util'
import {CommandPayload} from './command-payload'
import {getSpotifyApi} from '../spotify/client'

export const setPlaylistCommandRoute: Hapi.ServerRoute = {
  method: 'POST',
  path: '/get-playlist',
  handler: async (request, h) => {
    const {channel_id, channel_name} = request.payload as CommandPayload

    const channel = await ChannelModel.findOne({
      channelId: channel_id,
      channelName: channel_name,
    })
    if (!channel) {
      return 'No channel found, run /setup'
    }
    if (!channel.spotifyProfile.playlistUri) {
      return 'No playlist set, run /set-playlist'
    }

    return sendMessage({
      text: `Playlist: ${channel.spotifyProfile.playlistUri}`,
      channel: channel_id,
      emoji: ':musical_score:',
    })
  },
}
