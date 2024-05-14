import axios from 'axios'

import GENIUS_URL from '../constants/GENIUS_URL.js'
import geniusToken from '../private/geniusToken.js'

class MetaController {
  params = {
    headers: {
      Authorization: `Bearer ${geniusToken}`,
    },
  }

  async fetchSongData(route) {
    const { data } = await axios.get(GENIUS_URL + route, this.params)

    const { title, album, artist_names } = data.response.song

    console.log(title, artist_names)

    if (album) {
      const { name, artist } = album
      console.log(name, artist.name)
    }
  }

  async getSongs(query) {
    const { data } = await axios.get(
      `${GENIUS_URL}/search?q=${query}`,
      this.params
    )

    const { hits } = data.response
    const results = hits.map(({ result }, id) => {
      return `[${id + 1}] ${result.artist_names} - ${result.title}`
    })

    await this.fetchSongData(hits[0].result.api_path)

    return results
  }
}

export default new MetaController()
