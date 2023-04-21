import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify'
import fastify from 'fastify'
import { appRouter } from './router'
import { createContext } from './router/context'

export interface ServerOptions {
  dev?: boolean
  port?: number
  prefix?: string
}

export function createServer(opts: ServerOptions) {
  const dev = opts.dev ?? true
  const host = opts.dev ? 'localhost' : '0.0.0.0'
  const port = opts.port ?? 8080
  const prefix = opts.prefix ?? '/trpc'
  const server = fastify({ logger: dev, maxParamLength: 5000 })

  void server.register(fastifyTRPCPlugin, {
    prefix,
    trpcOptions: { router: appRouter, createContext },
  })

  server.get('/', async () => {
    return { hello: 'wait-on 💨' }
  })

  const stop = async () => {
    await server.close()
  }
  const start = async () => {
    try {
      await server.listen({ host, port })
      console.log('listening on port', port)
    } catch (err) {
      server.log.error(err)
      process.exit(1)
    }
  }

  return { server, start, stop }
}
