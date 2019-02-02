import {WebClient} from '@slack/client'

const token = process.env['SLACK_TOKEN'] || ''

export const slackWebClient = new WebClient(token)

interface SendMessageArgs {
  text: string
  channel: string
  emoji?: string
}
export function sendMessage({text, channel, emoji}: SendMessageArgs) {
  return slackWebClient.chat.postMessage({
    text,
    channel,
    icon_emoji: emoji,
  })
}

interface SendEphemeralArgs {
  text: string
  channel: string
  user: string
}

export function sendEphemeral({text, channel, user}: SendEphemeralArgs) {
  return slackWebClient.chat.postEphemeral({
    text,
    channel,
    user,
  })
}

export const emojis = {
  hankey: ':hankey:',
  church: ':church:',
}

export function stripLinkTags(str: string) {
  return str.replace(/(<|>)/g, '')
}
