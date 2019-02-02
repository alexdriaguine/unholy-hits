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
  path: '/set-playlist',
  handler: async (request, h) => {
    const {channel_id, channel_name, text} = request.payload as CommandPayload
    const channel = await ChannelModel.findOne({
      channelName: channel_name,
      channelId: channel_id,
    })

    const playlistUri = stripLinkTags(text)
    const playlistId = playlistUri.split(':')[4]

    if (!channel) {
      return sendMessage({
        text: `Woopsie, it seems like you haven't run the /setup command to set me up with spotify :hankey:`,
        channel: channel_id,
        emoji: emojis.hankey,
      })
    }

    if (playlistId.length === 0) {
      return 'Hey, I need a frickin playlist url.'
    }

    const api = getSpotifyApi({
      accessToken: channel.spotifyProfile.accessToken,
      refreshToken: channel.spotifyProfile.refreshToken,
    })

    return api
      .getPlaylist(playlistId)
      .then(() => {
        channel.spotifyProfile.playlistUri = playlistId
        return channel.save()
      })
      .then(() =>
        sendMessage({
          text: `set channel playlist to ${playlistUri}`,
          channel: channel_id,
        }),
      )
      .then(() => '')
      .catch(() => 'Ill fkn wrek u m8 if u give me faulty input again')
  },
}
