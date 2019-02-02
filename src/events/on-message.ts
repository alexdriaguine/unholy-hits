import {
  slackWebClient,
  sendMessage,
  emojis,
  stripLinkTags,
  sendEphemeral,
} from '../slack'
import * as Boom from 'boom'
import {MessageEvent} from './event'
import {URL} from 'url'
import {ISpotifyWebApi, getSpotifyApi} from '../spotify/client'
import {ChannelModel, channelSchema} from '../db/channel'

export async function onMessage(event: MessageEvent) {
  let trackResourceUri: string

  const text = stripLinkTags(event.text)

  if (text.startsWith('http') && text.includes('track')) {
    const url = new URL(text)
    const parts = url.pathname.split('/')

    if (!parts.includes('track') && parts.length < parts.indexOf('track') + 1) {
      return Boom.badRequest('NO TRACK ID')
    }
    
    trackResourceUri = `spotify:track:${parts[parts.indexOf('track') + 1]}` // id comes after track, "track/{id}"
  } else if (text.startsWith('spotify:track:')) {
    trackResourceUri = text
  } else {
    // Ignore everyting else
    return {}
  }
  const channel = await ChannelModel.findOne({
    channelId: event.channel, // Sure hope this 11 character string is unique
  })

  if (!channel) {
    return 'No channel found, run /setup m8'
  }
  if (!channel.spotifyProfile.playlistUri) {
    return 'No playlist found, run /set-playlist m8'
  }

  const spotifyApi = getSpotifyApi({
    accessToken: channel.spotifyProfile.accessToken,
    refreshToken: channel.spotifyProfile.refreshToken,
  })

  const playlist = await spotifyApi.getPlaylist(
    channel.spotifyProfile.playlistUri,
  )

  const exists = !!playlist.body.tracks.items.find(
    ({track}: {track: {uri: string}}) => track.uri === trackResourceUri,
  )


  if (exists) {
    return sendEphemeral({
      text:
        'U tryin to be funny u cheeky lil twat. I already have that song in my playlist so sob off',
      channel: event.channel,
      user: (event as any).user,
    })
  }

  return spotifyApi
    .addTracksToPlaylist(channel.spotifyProfile.playlistUri, [trackResourceUri])
    .then(res =>
      sendMessage({
        text: `some fella added a track!: ${trackResourceUri}.`,
        emoji: emojis.church,
        channel: event.channel,
      }),
    )
    .then(() => ({status: 'ok'}))
    .catch(Boom.boomify)
}
