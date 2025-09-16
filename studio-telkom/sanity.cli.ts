import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: '1btnolup',
    dataset: 'dev'
  },
  studioHost: process.env.SANITY_STUDIO_HOSTNAME,
  autoUpdates: true,
})
