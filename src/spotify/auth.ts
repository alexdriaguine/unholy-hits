import * as Hapi from 'hapi'
import * as Bell from 'bell'
import {slackWebClient, sendMessage, emojis} from '../slack'
import * as Boom from 'boom'
import {IChannel, ChannelModel} from '../db/channel'

export const SPOTIFY_CLIENT_ID = process.env['SPOTIFY_CLIENT_ID'] || ''
export const SPOTIFY_CLIENT_SECRET = process.env['SPOTIFY_CLIENT_SECRET'] || ''
export const SPOTIFY_REDIRECT_URI = process.env['SPOTIFY_REDIRECT_URI'] || ''
export const SPOTIFY_PASSWORD = process.env['SPOTIFY_PASSWORD'] || ''

export const spotifyAuthPlugin: Hapi.Plugin<{}> = {
  name: 'spotifyAuthPlugin',
  register: async server => {
    await server.register(Bell)

    server.auth.strategy('spotify', 'bell', {
      provider: 'spotify',
      clientId: SPOTIFY_CLIENT_ID,
      clientSecret: SPOTIFY_CLIENT_SECRET,
      password: SPOTIFY_PASSWORD,
      location: SPOTIFY_REDIRECT_URI,
      isSecure: true,
      scope: [
        'user-read-email',
        'playlist-read-collaborative',
        'playlist-modify-public',
        'playlist-read-private',
        'playlist-modify-private',
      ],
    })

    server.route({
      method: ['GET', 'POST'],
      path: '/spotify/callback',
      options: {
        auth: 'spotify',
        handler: async (request, h) => {
          if (!request.auth.isAuthenticated) {
            return Boom.unauthorized()
          }

          const {
            query,
            token: accessToken,
            refreshToken,
            profile,
            expiresIn,
          } = request.auth.credentials as any

          const now = new Date().getTime()
          const toAdd = expiresIn * 1000
          const tokenExpirationDate = new Date(now + toAdd)

          const channelData: IChannel = {
            channelName: query.channelName,
            channelId: query.channelId,
            spotifyProfile: {
              id: profile.id,
              username: profile.username,
              accessToken,
              refreshToken,
              tokenExpirationDate,
            },
          }

          const channel = new ChannelModel(channelData)

          return channel
            .save()
            .then(() =>
              sendMessage({
                text: `${
                  (request.auth.credentials as any).profile.username
                } authenticaded their spotify account`,
                channel: query.channelId,
                emoji: emojis.church,
              }),
            )
            .catch(Boom.boomify)
        },
      },
    })
  },
}
