import inquirer from 'inquirer'

import MetaController from './src/api/MetaController.js'
import AudioController from './src/api/AudioController.js'

import getBracketsIndex from './src/utils/getBracketsIndex.js'

const metaQueryHistory = []
const youtubeQueryHistory = []
const metaHistory = []
const idHistory = []

async function askQuery() {
  const { query } = await inquirer.prompt({
    type: 'input',
    name: 'query',
    message: 'Enter your query',
  })

  const metaOptions = await MetaController.getMetaList(query)
  const youtubeOptions = await AudioController.getAudioList(query)

  metaQueryHistory.push(metaOptions)
  youtubeQueryHistory.push(youtubeOptions)
}

async function askMetadata() {
  const metaOptions = metaQueryHistory[metaQueryHistory.length - 1]
  const choices = metaOptions.map(item => item.title)
  const { selectedMetaIndex } = await inquirer.prompt({
    type: 'list',
    name: 'selectedMetaIndex',
    message: 'Select metadata from Genius',
    choices: [...choices, '[X] There is no my music('],
  })

  if (selectedMetaIndex[1] === 'q') process.exit(0)
  const { route } = metaOptions[getBracketsIndex(selectedMetaIndex)]
  const metadata = await MetaController.fetchSongData(route)

  metaHistory.push(metadata)
}

async function askAudio() {
  const youtubeOptions = youtubeQueryHistory[youtubeQueryHistory.length - 1]
  const choices = youtubeOptions.map(item => item.title)
  const { selectedAudioIndex } = await inquirer.prompt({
    type: 'list',
    name: 'selectedAudioIndex',
    message: 'Select song from YouTube',
    choices,
  })

  const { id } = youtubeOptions[getBracketsIndex(selectedAudioIndex)]
  idHistory.push(id)
}

async function downloadMusic() {
  const meta = metaHistory[metaHistory.length - 1]
  const id = idHistory[idHistory.length - 1]

  await AudioController.downloadAudio(id, meta.full_title)
  await AudioController.setAudioTags(meta)

  console.log('Successfully downloaded!')
}

async function getMusic() {
  await askQuery()
  await askMetadata()
  await askAudio()
  await downloadMusic()

  const { continueApplication } = await inquirer.prompt({
    type: 'confirm',
    name: 'continueApplication',
    message: 'Do you want to find another song?',
    default: true,
  })

  if (continueApplication) {
    getMusic()
  }
}

await getMusic()
