import * as Hapi from 'hapi'
import * as Bell from 'bell'
import {slackWebClient} from '../slack'
import * as Boom from 'boom'
import {IChannel, ChannelModel} from '../db/channel'

const SPOTIFY_CLIENT_ID = process.env['SPOTIFY_CLIENT_ID'] || ''
const SPOTIFY_CLIENT_SECRET = process.env['SPOTIFY_CLIENT_SECRET'] || ''

export const spotifyAuthPlugin: Hapi.Plugin<{}> = {
  name: 'spotifyAuthPlugin',
  register: async server => {
    await server.register(Bell)

    server.auth.strategy('spotify', 'bell', {
      provider: 'spotify',
      clientId: SPOTIFY_CLIENT_ID,
      clientSecret: SPOTIFY_CLIENT_SECRET,
      password:
        'dude-generate-this-shit-later-with-something-byt-for-now-this-is-enought-localhost-shizzle',
      location: 'https://unholy.localtunnel.me',
      isSecure: true,
      scope: ['user-read-email'],
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

          const {query, token: accessToken, refreshToken, profile} = request
            .auth.credentials as any          

          const channelData: IChannel = {
            channelName: query.channelName,
            channelId: query.channelId,
            spotifyProfile: {
              id: profile.id,
              username: profile.username,
              accessToken,
              refreshToken,
            },
          }

          const channel = new ChannelModel(channelData)

          return channel
            .save()
            .then(() =>
              slackWebClient.chat.postMessage({
                text: `${
                  (request.auth.credentials as any).profile.username
                } authenticaded their spotify account`,
                channel: query.channelId,
              }),
            )
            .then(() => ({status: 'OK', message: 'Authenticated'}))
        },
      },
    })
  },
}
