const fileRouter = require('express').Router()
const azureStorage = require('azure-storage')
const multer = require('multer')
const getStream = require('into-stream')
const config = require('../utils/config')
const logger = require('../utils/logger')

const account = config.AZURE_STORAGE_ACCOUNT_NAME
const accountKey = config.AZURE_STORAGE_ACCOUNT_ACCESS_KEY

const inMemoryStorage = multer.memoryStorage()
const uploadStrategy = multer({ storage: inMemoryStorage }).array('filesToAdd')

const containerName = 'files'

// Init blob service 
const blobService = azureStorage.createBlobService(account, accountKey)
blobService.createContainerIfNotExists(containerName, { publicAccessLevel: 'blob' }, (error) => {
  if (error) {
    logger.error('Error:', error)
  }
})

// create unique blob name for storing
const getBlobName = (originalName) => {
  const identifier = Math.random().toString().replace(/0\./, '')
  return `${identifier}-${originalName}`
}

// Delete blobs if list is given, Add files to blob storage
fileRouter.post('/', uploadStrategy, (req, res) => {
  if (req.body.filesToDelete && req.body.filesToDelete.length > 0) {
    const filesToDelete = req.body.filesToDelete.split(',')
    for (let i = 0; i < filesToDelete.length; i++) {
      blobService.deleteBlob(containerName, filesToDelete[i], (error) => {
        if (error) {
          logger.error('Error:', error)
          res.status(500).end()
        }
      })
    }
  }

  const blobNames = []
  for (let i = 0; i < req.files.length; i++) {
    const blobName = getBlobName(req.files[i].originalname)
    blobNames.push(blobName)
    const stream = getStream(req.files[i].buffer)
    const streamLength = req.files[i].buffer.length

    blobService.createBlockBlobFromStream(containerName, blobName, stream, streamLength, (error) => {
      if (error) {
        logger.error('Error:', error)
        res.status(500).end()
      }
    })
  }

  res.send(blobNames)
})

module.exports = fileRouter
