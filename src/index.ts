import { createServer } from './server'

const server = createServer({
  dev: process.env.NODE_ENV !== 'production',
})

void server.start()
