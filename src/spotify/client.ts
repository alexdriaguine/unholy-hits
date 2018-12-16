import * as SpotifyWebApi from 'spotify-web-api-node'
import {SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET} from './auth'

interface KeyValue {
  [key: string]: string
}

export interface ISpotifyWebApi {
  setAccessToken(token: string): void

  getTrack(trackId: string, options: KeyValue): Promise<any>
  search(
    query: string,
    types: 'alumb' | 'artist' | 'playlist' | 'track'[],
    options?: {limit?: number; offset?: number},
  ): Promise<any>
  searchTrack(
    query: string,
    options?: {limit?: number; offset?: number},
  ): Promise<any>
  addTracksToPlaylist(playlistId: string, tracks: string[]): Promise<any>
  getPlaylist(playlistId: string, options?: KeyValue): Promise<any>
}

export function getSpotifyApi(): ISpotifyWebApi {
  return new SpotifyWebApi({
    clientId: SPOTIFY_CLIENT_ID,
    clientSecret: SPOTIFY_CLIENT_SECRET,
  })
}
