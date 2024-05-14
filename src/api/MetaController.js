import axios from 'axios'

import GENIUS_URL from '../constants/GENIUS_URL.js'
import GENIUS_ACCESS_TOKEN from '../private/GENIUS_ACCESS_TOKEN.js'

class MetaController {
  params = {
    headers: {
      Authorization: `Bearer ${GENIUS_ACCESS_TOKEN}`,
    },
  }

  async fetchSongData(route) {
    const { data } = await axios.get(GENIUS_URL + route, this.params)

    const { title, album, artist_names } = data.response.song

    if (!album)
      return {
        title,
        album: title,
        artist: artist_names,
        album_artist: artist_names,
      }

    return {
      title,
      album: album.name,
      artist: artist_names,
      album_artist: album.artist.name,
    }
  }

  async getSongsList(query) {
    const { data } = await axios.get(
      `${GENIUS_URL}/search?q=${query}`,
      this.params
    )

    const { hits } = data.response
    const results = hits.map(({ result }, id) => {
      return {
        title: `[${id + 1}] ${result.artist_names} - ${result.title}`,
        route: result.api_path,
      }
    })

    return results
  }
}

export default new MetaController()
