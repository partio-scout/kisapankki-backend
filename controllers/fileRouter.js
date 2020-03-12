const fileRouter = require('express').Router()
require('dotenv').config()
 
const account = process.env.AZURE_STORAGE_ACCOUNT_NAME
const accountKey = process.env.AZURE_STORAGE_ACCOUNT_ACCESS_KEY

const multer = require('multer')
const inMemoryStorage = multer.memoryStorage()
const uploadStrategy = multer({ storage: inMemoryStorage }).array('files')
const getStream = require('into-stream')
const containerName = 'files'

const azureStorage = require('azure-storage')
const blobService = azureStorage.createBlobService(account, accountKey)
blobService.createContainerIfNotExists(containerName, { publicAccessLevel : 'blob' }, err => {
  if (err) {
    console.log(error)
  }
})

const getBlobName = originalName => {
  const identifier = Math.random().toString().replace(/0\./, '') 
  return `${identifier}-${originalName}`
}

fileRouter.post('/', uploadStrategy, (req, res, next) => {
    let blobNames = []
    for (let i = 0; i < req.files.length; i++) {
      const blobName = getBlobName(req.files[i].originalname)
      blobNames.push(blobName)
      const stream = getStream(req.files[i].buffer)
      const streamLength = req.files[i].buffer.length

      blobService.createBlockBlobFromStream(containerName, blobName, stream, streamLength, err => {
        if(err) {
          console.log(err)
          res.status(500).end()
        }
      })
    }
    res.send(blobNames)  
})

module.exports = fileRouter
