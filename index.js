import inquirer from 'inquirer'
import { Subject } from 'rxjs'

import MetaController from './src/api/MetaController.js'

const queryHistory = []

const prompts = new Subject()
inquirer.prompt(prompts).ui.process.subscribe({
  next: async ({ name, answer }) => {
    switch (name) {
      case 'query':
        const songsList = await MetaController.getSongsList(answer)
        queryHistory.push({
          query: answer,
          result: songsList,
        })
        const choices = songsList.map(item => item.title)
        prompts.next({
          type: 'list',
          name: 'selectedSong',
          message: 'Select song for metadata',
          choices,
        })
        break

      case 'selectedSong':
        const { result } = queryHistory[queryHistory.length - 1]
        const { route } = result[Number(answer[1]) - 1]
        const songMetadata = await MetaController.fetchSongData(route)
        console.log(songMetadata)
        break

      default:
        break
    }
    prompts.complete()
  },
  error: e => console.log(e),
  complete: () => console.log('COMPLETE'),
})

prompts.next({
  type: 'input',
  name: 'query',
  message: 'Enter your query',
})

// const tags = {
//   title: 'Caliente',
//   artist: 'Kontra K',
//   performerInfo: 'NONAME',
//   unsynchronisedLyrics: {
//     language: 'eng',
//     text: 'lyrics',
//   },
//   album: 'Single',
//   APIC: 'https://images.genius.com/4e08cebc1ffa69e057a3b33ecbec670d.1000x1000x1.jpg',
// }

// NodeID3.write(tags, './test.mp3')
