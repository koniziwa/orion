import axios from 'axios'
import chalk from 'chalk'
import figlet from 'figlet'
import { select } from '@inquirer/prompts'

import YOUTUBE_GET_URL from './urls/YOUTUBE_GET_URL.js'
import GOOGLE_API_KEY from './private/api_keys/GOOGLE_API_KEY.js'

const query = 'STRIPPER HEELS Slattcrank'

const { data } = await axios.get(YOUTUBE_GET_URL, {
  params: {
    part: 'snippet',
    q: query,
    type: 'video',
    maxResults: 5,
    key: GOOGLE_API_KEY,
  },
})

async function printOrion() {
  const text = await figlet.text('| ORION |', { font: 'Slant' })
  console.log(chalk.red(text))
}

const youtubeChoices = data.items.map((item, index) => {
  const { snippet, id } = item
  const { title, channelTitle } = snippet
  return {
    name: chalk.white(`${index + 1}. "${title}" by ${channelTitle}`),
    value: id.videoId,
  }
})

async function main() {
  await printOrion()
  console.log('\n')

  const answer = await select({
    message: chalk.cyan('Select video source:'),
    choices: youtubeChoices,
    loop: false,
    theme: {
      style: {
        highlight: (text) => chalk.bold(text),
        answer: (text) => chalk.cyan(text),
      },
    },
  })

  console.log(answer)
}

main()
