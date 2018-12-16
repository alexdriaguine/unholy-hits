import * as mongoose from 'mongoose'

// @ts-ignore
mongoose.Promise = global.Promise

export function connect() {
  const connectionString = process.env['MONGO_DB_CONNECTION_STRING'] || ''
  return mongoose.connect(
    connectionString,
    {
      useNewUrlParser: true,
    },
  )
}
