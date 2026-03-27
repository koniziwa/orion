import NodeID3 from 'node-id3'
import chalk from 'chalk'
import { renameSync } from 'fs'

class MusicService {
  renameFile(old_name, new_name) {
    renameSync(`music/${old_name}.mp3`, `music/${new_name}.mp3`)
  }

  attachMeta(id, metadata) {
    const mp3Path = `music/${id}.mp3`
    const { title, artist, apic, album_title, album_artist } = metadata

    const tags = {
      title,
      artist,
      album: album_title,
      performerInfo: album_artist,
      image: {
        mime: 'image/png',
        type: { id: 0, name: 'other' },
        imageBuffer: apic,
      },
    }

    return new Promise((resolve, reject) => {
      NodeID3.update(tags, mp3Path, (err) => {
        if (err) {
          console.log(err)
          reject()
        } else {
          console.log('\n')
          console.log(chalk.green('Successfully added tags!'))
          resolve()
        }
      })
    })
  }
}

export default MusicService
