const { StorageSharedKeyCredential, BlockBlobClient } = require('@azure/storage-blob')
const config = require('../utils/config')

const credentials = new StorageSharedKeyCredential(`${config.AZURE_STORAGE_ACCOUNT_NAME}`, `${config.AZURE_STORAGE_ACCOUNT_ACCESS_KEY}`)

// Downloads files named in param list from blob storage
const downloadBlobs = async (fileNameList) => {
  fileNameList.forEach(async (fileName) => {
    const downloader = new BlockBlobClient(
      `https://${config.AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net/files/${fileName}`,
      credentials,
    )
    await downloader.downloadToFile(`${fileName}`, 0, undefined)
  })
}

module.exports = { downloadBlobs }
