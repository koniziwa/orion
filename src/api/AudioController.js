import axios from 'axios'
import NodeID3 from 'node-id3'
import shell from 'shelljs'
import ytdl from 'ytdl-core'
// import { readFileSync } from 'fs'
import ffmpeg from 'fluent-ffmpeg'

import YOUTUBE_API_URL from '../constants/YOUTUBE_API_URL.js'
import YOUTUBE_ACCESS_TOKEN from '../private/YOUTUBE_ACCESS_TOKEN.js'

class AudioController {
  ffmpegPath = shell.which('ffmpeg').stdout
  filenameRegexp = /[\\\/:*?"<>|]/gi

  async getAudioList(query) {
    const { data } = await axios.get(
      `${YOUTUBE_API_URL}?part=snippet&maxResults=10&q=${query}&key=${YOUTUBE_ACCESS_TOKEN}`
    )

    // const data = JSON.parse(
    //   readFileSync('./src/tests/testYoutubeData.json', 'utf8')
    // )

    const result = data.items.map(({ id, snippet }, index) => {
      const { title, channelTitle } = snippet
      return {
        title: `[${index + 1}] [${channelTitle}] ${title}`,
        id: id.videoId,
      }
    })

    return result
  }

  downloadAudio(id, filename) {
    return new Promise(resolve => {
      const newFilename = filename.replace(this.filenameRegexp, '')
      const stream = ytdl(id, { quality: 'highestaudio', filter: 'audioonly' })
      ffmpeg(stream)
        .setFfmpegPath(this.ffmpegPath)
        .audioBitrate(128)
        .saveToFile(`./dist/${newFilename}.mp3`)
        .on('end', () => {
          resolve()
        })
    })
  }

  async setAudioTags({
    full_title,
    title,
    album,
    artist,
    album_artist,
    song_art_image_url,
  }) {
    const { data } = await axios.get(song_art_image_url, {
      responseType: 'arraybuffer',
    })

    const tags = {
      title,
      artist,
      album,
      performerInfo: album_artist,
      APIC: {
        mime: 'image/jpg',
        type: { id: 0, name: 'other' },
        imageBuffer: data,
      },
    }

    const filename = full_title.replace(this.filenameRegexp, '')
    NodeID3.write(tags, `./dist/${filename}.mp3`)
  }
}

export default new AudioController()
