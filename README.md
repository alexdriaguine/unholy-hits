## TODO
- [ ] figure out how we setup this shit. one option - /setup command, that will create a record for this
channel in the db, and present a spotify oauth link, connect the spotify account and save it in db. Other is, as soon as we deploy this bot
into the channel, the bot greets us and runs the setup. Should be basic at first, no mumbo jumbo
- [ ] bot should create a playlist, MVP - only one playlist allowed. (still could have playlists as array in db for future support?)
- [ ] bot should be able to put spotify uri links into the playlist `spotify:asd:asd`
- [ ] bot MUST be able to swap the refresh token if access_token invalid
- [ ] bot MUST be able to push a message to the channel that the spotify connection is list and we need to reconnect. IMPORTANT that the same account does this, if
another spotify account, new playslist must be generated (no support, only same account for starters)
- [ ] delete, if we want to reset the bot for a channel, delete shit 
- [ ] /add command, that takes Artist - Song, searches, presents findings (interactive component), and adds to playlist
- [ ] DO NOT ADD DUPLICATES