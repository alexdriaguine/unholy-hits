## TODO, version 1
- [x] figure out how we setup this shit. one option - /setup command, that will create a record for this
channel in the db, and present a spotify oauth link, connect the spotify account and save it in db. Other is, as soon as we deploy this bot
into the channel, the bot greets us and runs the setup. Should be basic at first, no mumbo jumbo
- [x] bot should be able to put spotify uri links into the playlist `spotify:asd:asd`
- [ ] bot MUST be able to swap the refresh token if access_token invalid
- [ ] store playlist id in mongo
- [ ] command to set playlist id
- [ ] command to get playist link
- [ ] prepare for deploy
- [ ] delete, if we want to reset the bot for a channel, delete shit 
- [ ] /add command, that takes Artist - Song, searches, presents findings (interactive component), and adds to playlist
- [x] DO NOT ADD DUPLICATES

## TODO, future
- [ ] interactive component upon /setup command. should, after connecting spotify, ask if create playlist, or select one from dropdown.