require('dotenv').config()

const { PORT } = process.env
const { APPLICATION_STAGE } = process.env
const { COSMOS_DB_URI } = process.env
const { AZURE_STORAGE_ACCOUNT_NAME } = process.env
const { AZURE_STORAGE_ACCOUNT_ACCESS_KEY } = process.env

let MONGODB_URI
if (process.env.NODE_ENV === 'test') {
  MONGODB_URI = process.env.TEST_MONGODB_URI
} else {
  MONGODB_URI = process.env.MONGODB_URI
}

module.exports = {
  PORT,
  MONGODB_URI,
  APPLICATION_STAGE,
  COSMOS_DB_URI,
  AZURE_STORAGE_ACCOUNT_NAME,
  AZURE_STORAGE_ACCOUNT_ACCESS_KEY
}
