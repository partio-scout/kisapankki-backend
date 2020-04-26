const createContentForPDF = (printedTask, logo, contestInfo) => {
  const competitionInfo = `<br/>
      <br/>
      ${contestInfo.name}<br/>
      ${contestInfo.date}<br/>
      ${contestInfo.place}<br/>
      ${contestInfo.type}<br/>`
  let joinedText = `<style>
    .col2 {
      columns: 2 100px;
      -webkit-columns: 2 100px;
      -moz-columns: 2 100px;
    }
  </style> \n`
  joinedText
    += `<style>
    .col1 {
      columns: 1 50px;
      -webkit-columns: 1 50px;
      -moz-columns: 1 50px;
    }
  </style> \n`
  joinedText += `<div class="col2" markdown="1">
  <div class="col1" style="text-align: left;" markdown="1">${competitionInfo}</div>`
  if (logo) {
    joinedText += `<div class="col1" style="text-align: right;"><img height="110" width="110" alt="logo" src="data:image/png;base64,${logo.buffer.toString('base64')}"></div></div>`
  } else {
    joinedText += '<div class="col1" style="text-align: right;"><img height="95" width="200" alt="logo" src="../images/partio_logo_rgb_musta.png"></div></div>'
  }
  joinedText += '\n'
  joinedText += '\n'
  joinedText += `# ${printedTask.name}\n`
  joinedText += `# Tehtävänanto\n${printedTask.assignmentTextMD}\n`
  joinedText += `# Arvostelu\n${printedTask.gradingScaleMD}`
  joinedText += '<div class="page-break"></div>'
  joinedText += '\n'
  joinedText += '\n'
  const supervText = `# Rastimiehen ohjeet\n${printedTask.supervisorInstructionsMD}\n`
  joinedText += supervText
  joinedText += `# Arvostelu\n${printedTask.gradingScaleMD}`

  return joinedText
}

module.exports = { createContentForPDF }
