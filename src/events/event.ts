export enum EventTypes {
  UrlVerification = 'url_verification',
  Message = 'message',
}

export interface MessageEvent {
  challenge: string
  type: string
  subtype: string
  channel: string
  text: string
  user: string
}
