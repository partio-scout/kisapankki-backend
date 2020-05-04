// Add PDFs to zip file, Task and its files are in directory named after the task
const zipMaterials = async (archive, taskJSON) => {
  taskJSON.forEach((task) => {
    archive.file(task.pdfName, { name: `${task.folderName}/${task.pdfName}` })
    task.files.forEach((file) => {
      // Remove blob storage id from name, also deletes all instances of '-' 
      const splits = file.split('-')
      let fileName = ''
      for (let i = 1; i < splits.length; i++) {
        fileName += splits[i]
      }
      archive.file(file, { name: `${task.folderName}/${fileName}` })
    })
  })

  return archive
}

module.exports = { zipMaterials }
