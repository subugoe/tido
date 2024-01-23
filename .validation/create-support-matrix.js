const fs = require('fs')

const gitlabBaseUrl = process.env.GITLAB_BASE_URL
const projectId = process.env.GITLAB_VALIDATION_PROJECT_ID
const token = process.env.GITLAB_ACCESS_TOKEN

async function getSchemaFilesList() {
  const url =`${gitlabBaseUrl}/projects/${projectId}/repository/tree?path=schema`

  const response = await fetch(url, {
    headers: {
      'PRIVATE-TOKEN': token,
    },
  });

  if (response.ok) {
    const data = await response.json();
    return data.map(e =>  e.path);
  } else {
    throw `An error occurred while fetching: ${url}`;
  }
}

async function getFileContent(path) {
  const url = `${gitlabBaseUrl}/projects/${projectId}/repository/files/${encodeURIComponent(path)}/raw`

  try {
    const response = await fetch(url, {
      headers: {
        'PRIVATE-TOKEN': token,
      },
    });

    if (response.ok) {
      return await response.json();
    } else {
      throw `An error occurred while fetching: ${url}`;
    }

  } catch(e) {
    console.log(e)
  }
}

function getSupportColor(value) {
  const red = '#d97a75'
  const yellow = '#d9c873'
  const green = '#80ba73'
  const grey = '#bababa'

  if (value === 0) return red
  if (value === 1) return green
  if (value === 2) return yellow
  return grey
}

function getSupportStatusText(value) {
  if (value === 0) return 'not supported'
  if (value === 1) return 'supported'
  if (value === 2) return 'partially supported'
  return 'unused'
}

function createTable(data) {

  const header = `# TextAPI Support

  This document shows which TextAPI keys TIDO supports in the current version.

  `
  let template = `${header}<table><tr><th>Object</th><th>Field</th><th>Supported</th></tr>`

  Object.keys(data).forEach((objectKey, i) => {
    template += Object.keys(data[objectKey]).map((fieldKey, j) => {
      const objectCell = j === 0 ? '<td rowspan="' + Object.keys(data[objectKey]).length + '">' + objectKey + '</td>' : ''
      return `<tr>${objectCell}<td>${fieldKey}</td><td style="background:${getSupportColor(data[objectKey][fieldKey])}">${getSupportStatusText(data[objectKey][fieldKey])}</td></tr>`
    }).join('')
  })

  template += '</table>'

  return template
}

(async () => {
  const supportMatrixFileName = __dirname  + '/support-matrix.json'
  const supportMatrixExists = fs.existsSync(supportMatrixFileName)
  let supportMatrix = {}

  if (supportMatrixExists) {
    // If the support matrix was generated before, just read it
    supportMatrix = JSON.parse(fs.readFileSync(supportMatrixFileName))
  } else {
    // Read JSON schema files from TextAPI specs repo and generate a new support matrix JSON
    const filesList = await getSchemaFilesList()

    for (let i = 0; i < filesList.length; i++) {
      const content = await getFileContent(filesList[i])
      if (!content || !content.properties) continue
      const textApiKeys = Object.keys(content.properties)
      supportMatrix[content['$id'].replace('.json', '')] = textApiKeys.reduce((acc, cur) => {
        acc[cur] = 0
        return acc
      }, {})
    }

    // Store the new support matrix as JSON in file
    try {
      fs.writeFileSync(supportMatrixFileName, JSON.stringify(supportMatrix), 'utf-8');
    } catch(e) {
      console.log(e)
    }
  }

  // Render table in SUPPORT.md
  try {
    const fileName = __dirname  + '/../SUPPORT.md'
    fs.writeFileSync(fileName, createTable(supportMatrix), 'utf-8');
  } catch(e) {
    console.log(e)
  }

})()

