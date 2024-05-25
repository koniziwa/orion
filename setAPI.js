import inquirer from 'inquirer'
import { existsSync, mkdirSync, writeFileSync } from 'fs'

async function setTokens() {
  const { GENIUS_API_KEY } = await inquirer.prompt({
    type: 'input',
    name: 'GENIUS_API_KEY',
    message: 'Enter your Genius API token',
  })
  writeFileSync(
    './src/private/GENIUS_ACCESS_TOKEN.js',
    `export default \'${GENIUS_API_KEY}\'`,
    'utf8'
  )

  const { YOUTUBE_API_KEY } = await inquirer.prompt({
    type: 'input',
    name: 'YOUTUBE_API_KEY',
    message: 'Enter your YouTube API token',
  })
  writeFileSync(
    './src/private/YOUTUBE_ACCESS_TOKEN.js',
    `export default \'${YOUTUBE_API_KEY}\'`,
    'utf8'
  )

  console.log('Successfully wrote tokens!')
}

if (!existsSync('./src/private')) {
  mkdirSync('./src/private')
  await setTokens()
} else {
  console.log('You already have tokens!')
}
