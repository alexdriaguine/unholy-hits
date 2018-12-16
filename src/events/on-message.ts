import {slackWebClient} from '../slack'
import * as Boom from 'boom'
import {MessageEvent} from './event'
import {URL} from 'url'
import {ISpotifyWebApi, getSpotifyApi} from '../spotify/client'
import {ChannelModel} from '../db/channel'

export async function onMessage(event: MessageEvent) {
  let trackResourceUri: string

  const text = event.text.replace(/(<|>)/g, '')

  console.log('text:', text)

  // TODO: store in db, set with bot command
  const playlistId = '0rEur9a5W8pUVHqvBFIlsX'

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
    // Do nothing. todo: what do we return etc?
    return {}
  }

  const spotifyApi = getSpotifyApi()
  const channel = await ChannelModel.findOne({
    channelId: event.channel, // Sure hope this 11 character string is unique
  })

  if (!channel) {
    return slackWebClient.chat.postMessage({
      text: 'Nah, channel not found in db.. run /setup plz',
      icon_emoji: ':hankey:',
      channel: event.channel,
    })
  }

  console.log(trackResourceUri)

  spotifyApi.setAccessToken(channel.spotifyProfile.accessToken)

  const playlist = await spotifyApi.getPlaylist(playlistId)

  const exists = !!playlist.body.tracks.items.find(
    ({track}: {track: {uri: string}}) => track.uri === trackResourceUri,
  )

  if (exists) {
    return slackWebClient.chat.postMessage({
      text: 'Looks like that track already exists in the playlist',
      icon_emoji: ':hankey:',
      channel: event.channel,
    })
  }

  return spotifyApi
    .addTracksToPlaylist(playlistId, [trackResourceUri])
    .then(res => {
      console.log(res)

      return slackWebClient.chat.postMessage({
        text: `Added track!: ${trackResourceUri}.`,
        icon_emoji: ':church:',
        channel: event.channel,
      })
    })
    .then(() => ({status: 'ok'}))
    .catch(err => Boom.boomify(err))
}
