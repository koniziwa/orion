import axios from 'axios'
import chalk from 'chalk'
import cliProgress from 'cli-progress'
import { spawn } from 'child_process'

import GOOGLE_API_KEY from '../private/api_keys/GOOGLE_API_KEY.js'

import YOUTUBE_SEARCH_URL from '../urls/YOUTUBE_SEARCH_URL.js'
import YOUTUBE_VIDEO_URL from '../urls/YOUTUBE_VIDEO_URL.js'

class YoutubeService {
  async getVideoList(query) {
    const { data } = await axios.get(YOUTUBE_SEARCH_URL, {
      params: {
        part: 'snippet',
        q: query,
        type: 'video',
        maxResults: 5,
        key: GOOGLE_API_KEY,
      },
    })

    const youtubeChoices = data.items.map((item, index) => {
      const { snippet, id } = item
      const { title, channelTitle } = snippet
      return {
        name: `${index + 1}. "${title}" by ${channelTitle}`,
        value: id.videoId,
      }
    })

    return youtubeChoices
  }

  downloadVideo(videoId) {
    return new Promise((resolve, reject) => {
      console.log(chalk.yellow('\nInitializing...\n'))

      const progressBar = new cliProgress.SingleBar({
        format: chalk.cyan('Downloading [{bar}] | {value}%/{total}%'),
        barCompleteChar: '■',
        barIncompleteChar: ' ',
        hideCursor: true,
        barsize: 20,
      })

      const process = spawn('yt-dlp', [
        '--js-runtime',
        'node',
        '-f',
        'bestaudio',
        '--cookies',
        'private/cookies.txt',
        '-x',
        '--audio-format',
        'mp3',
        '--audio-quality',
        '0',
        '-o',
        `music/${videoId}.%(ext)s`,
        `${YOUTUBE_VIDEO_URL + videoId}`,
      ])

      let initialized = false

      process.stdout.on('data', (data) => {
        const message = data.toString()
        if (message.includes('[download]')) {
          const percent = parseFloat(message.split(/\s+/)[2])
          if (!initialized) {
            progressBar.start(100, 0)
            initialized = true
          }

          progressBar.update(percent)
        }
      })

      process.stderr.on('data', (data) => {
        console.error(data.toString())
      })

      process.on('close', (code) => {
        if (initialized) progressBar.update(100)
        progressBar.stop()
        console.log(chalk.magenta('\nSuccessfully downloaded!'))
        resolve()
      })
    })
  }
}

export default YoutubeService
