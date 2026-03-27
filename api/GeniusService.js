import axios from 'axios'

import GENIUS_API_KEY from '../private/api_keys/GENIUS_API_KEY.js'

import GENIUS_API_URL from '../urls/GENIUS_API_URL.js'

class GeniusService {
  async getMetaList(query) {
    const { data } = await axios.get(`${GENIUS_API_URL}/search`, {
      params: {
        q: query,
      },
      headers: {
        Authorization: `Bearer ${GENIUS_API_KEY}`,
      },
    })

    const geniusChoices = data.response.hits.map((item, index) => {
      const { full_title, api_path } = item.result

      return {
        name: `${index + 1}. ${full_title}`,
        value: api_path,
      }
    })

    return geniusChoices.slice(0, 5)
  }

  async getImageBuffer(cover_art_url) {
    const response = await axios.get(cover_art_url, {
      responseType: 'arraybuffer',
    })
    const buffer = Buffer.from(response.data)
    return buffer
  }

  async getSongMeta(song) {
    const { data } = await axios.get(GENIUS_API_URL + song, {
      headers: {
        Authorization: `Bearer ${GENIUS_API_KEY}`,
      },
    })

    let cover_art_url = ''
    let album_title = ''
    let album_artist = ''

    const { title, artist_names, song_art_image_url, album, full_title } =
      data.response.song

    if (album) {
      cover_art_url = album.cover_art_url
      album_title = album.name
      album_artist = album.primary_artist_names
    } else {
      cover_art_url = song_art_image_url
      album_title = title
      album_artist = artist_names
    }

    const buffer = await this.getImageBuffer(cover_art_url)

    return {
      title,
      artist: artist_names,
      album_title,
      album_artist,
      apic: buffer,
      full_title,
    }
  }
}

export default GeniusService
