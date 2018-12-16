import {Document, Schema, model} from 'mongoose'
import {string} from 'joi'

export interface IChannel {
  channelName: string
  channelId: string
  spotifyProfile: {
    id: string
    username: string
    accessToken: string
    refreshToken: string
  }
}

interface IChannelModel extends IChannel, Document {}

export var channelSchema: Schema = new Schema({
  channelName: String,
  channelId: String,
  spotifyProfile: {
    id: String,
    username: String,
    accessToken: String,
    refreshToken: String,
  },
})

export const ChannelModel = model<IChannelModel>('Channel', channelSchema)
