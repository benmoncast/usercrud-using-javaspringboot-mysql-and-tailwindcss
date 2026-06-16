import { createReadStream } from 'node:fs'
import { stat } from 'node:fs/promises'
import { createServer } from 'node:http'
import { extname, join, normalize, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const distDir = resolve(__dirname, 'dist')
const port = Number(process.env.PORT || 5173)

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
}

async function resolveFile(requestUrl) {
  const pathname = decodeURIComponent(new URL(requestUrl, `http://localhost:${port}`).pathname)
  const requestedPath = normalize(join(distDir, pathname))

  if (!requestedPath.startsWith(distDir)) {
    return null
  }

  try {
    const fileStat = await stat(requestedPath)

    if (fileStat.isFile()) {
      return requestedPath
    }
  } catch {
    return join(distDir, 'index.html')
  }

  return join(distDir, 'index.html')
}

const server = createServer(async (request, response) => {
  const filePath = await resolveFile(request.url)

  if (!filePath) {
    response.writeHead(403)
    response.end('Forbidden')
    return
  }

  response.writeHead(200, {
    'Content-Type': contentTypes[extname(filePath)] || 'application/octet-stream',
  })
  createReadStream(filePath).pipe(response)
})

server.listen(port, '127.0.0.1', () => {
  console.log(`React app ready at http://127.0.0.1:${port}/`)
})
