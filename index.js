import MetaController from './src/api/MetaController.js'

const query = 'ANIKV - Талия'

MetaController.getSongs(query).then(res => console.log(res))
