import chalk from 'chalk'
import figlet from 'figlet'
import { select, input } from '@inquirer/prompts'

import YoutubeService from './api/YoutubeService.js'
import GeniusService from './api/GeniusService.js'
import MusicService from './api/MusicService.js'

async function printOrion() {
  const text = await figlet.text('| ORION |', { font: 'Slant' })
  console.log(chalk.red(text))
}

async function main() {
  const youtubeService = new YoutubeService()
  const geniusService = new GeniusService()
  const musicService = new MusicService()

  let isRunning = true

  await printOrion()

  do {
    console.log('\n')
    const query = await input({
      message: chalk.blue('Type input query:'),
    })

    const youtubeChoices = await youtubeService.getVideoList(query)

    console.log('\n')
    const youtubeAnswer = await select({
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

    await youtubeService.downloadVideo(youtubeAnswer)

    const geniusChoices = await geniusService.getMetaList(query)

    console.log('\n')
    const geniusAnswer = await select({
      message: chalk.cyan('Select metadata source:'),
      choices: geniusChoices,
      loop: false,
      theme: {
        style: {
          highlight: (text) => chalk.bold(text),
          answer: (text) => chalk.cyan(text),
        },
      },
    })

    const songMeta = await geniusService.getSongMeta(geniusAnswer)

    await musicService.attachMeta(youtubeAnswer, songMeta)
    musicService.renameFile(youtubeAnswer, songMeta.full_title)

    console.log('\n')
    const continueProgram = await select({
      message: chalk.cyan('What should we do next?'),
      choices: [
        { name: '1. Download another audio', value: true },
        { name: '2. Exit program', value: false },
      ],
      loop: false,
      theme: {
        style: {
          highlight: (text) => chalk.bold(text),
          answer: (text) => chalk.cyan(text),
        },
      },
    })

    isRunning = continueProgram
  } while (isRunning)
}

main()
