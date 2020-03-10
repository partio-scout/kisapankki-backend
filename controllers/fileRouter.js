const fileRouter = require('express').Router()

const {
  Aborter,
  BlobURL,
  BlockBlobURL,
  ContainerURL,
  ServiceURL,
  StorageURL,
  SharedKeyCredential,
  uploadStreamToBlockBlob
} = require('@azure/storage-blob')

const multer = require('multer')
const inMemoryStorage = multer.memoryStorage()
const uploadStrategy = multer({ storage: inMemoryStorage }).array('files')
const getStream = require('into-stream')
const containerName = 'images'
const ONE_MEGABYTE = 1024 * 1024
const uploadOptions = { bufferSize: 4 * ONE_MEGABYTE, maxBuffers: 20 }
const ONE_MINUTE = 60 * 1000
// const aborter = Aborter.timeout(30 * ONE_MINUTE)

// const sharedKeyCredential = new SharedKeyCredential(
//   process.env.AZURE_STORAGE_ACCOUNT_NAME,
//   process.env.AZURE_STORAGE_ACCOUNT_ACCESS_KEY)
// const pipeline = StorageURL.newPipeline(sharedKeyCredential)
// const serviceURL = new ServiceURL(
//   `https://${process.env.AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net`,
//   pipeline
// )

const getBlobName = originalName => {
  // Use a random number to generate a unique file name, 
  // removing "0." from the start of the string.
  const identifier = Math.random().toString().replace(/0\./, '') 
  return `${identifier}-${originalName}`
}

fileRouter.post('/', uploadStrategy, async (req, res, next) => {
    let blobNames = []
    for (let i = 0; i < req.files.length; i++) {
      blobNames.push(getBlobName(req.files[i].originalname))
    }

    // const blobName = getBlobName(req.file.originalname)
    // const stream = getStream(req.file.buffer)
    // const containerURL = ContainerURL.fromServiceURL(serviceURL, containerName)
    // const blobURL = BlobURL.fromContainerURL(containerURL, blobName)
    // const blockBlobURL = BlockBlobURL.fromBlobURL(blobURL)

    try {
      // await uploadStreamToBlockBlob(aborter, stream,
      //   blockBlobURL, uploadOptions.bufferSize, uploadOptions.maxBuffers)
      res.send(blobNames) 
    } catch (err) {
      res.status(500).end()
    }
})

module.exports = fileRouter
