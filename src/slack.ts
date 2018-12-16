import {WebClient} from '@slack/client'

const token = process.env['SLACK_TOKEN'] || ''

export const slackWebClient = new WebClient(token)
