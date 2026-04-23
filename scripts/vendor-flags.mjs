import { access, mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')
const countriesPath = path.join(rootDir, 'app', 'countries.json')
const flagsDir = path.join(rootDir, 'public', 'flags')

const DOWNLOAD_RETRIES = 3

async function fileExists(filePath) {
  try {
    await access(filePath)
    return true
  }
  catch {
    return false
  }
}

async function downloadSvg(svgUrl, code) {
  let lastError = null

  for (let attempt = 1; attempt <= DOWNLOAD_RETRIES; attempt += 1) {
    try {
      const response = await fetch(svgUrl, {
        headers: {
          'User-Agent': 'globe-rush/vendor-flags',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const body = await response.text()

      if (!body.includes('<svg')) {
        throw new Error('Downloaded file is not SVG content')
      }

      return body
    }
    catch (error) {
      lastError = error
      if (attempt < DOWNLOAD_RETRIES)
        await new Promise(resolve => setTimeout(resolve, 300 * attempt))
    }
  }

  throw new Error(`Failed to download ${code}: ${String(lastError)}`)
}

async function main() {
  const source = await readFile(countriesPath, 'utf8')
  const countries = JSON.parse(source)

  if (!Array.isArray(countries)) {
    throw new TypeError('countries.json must be an array')
  }

  await mkdir(flagsDir, { recursive: true })

  let downloadedCount = 0

  for (const country of countries) {
    const code = String(country.cca3 ?? '').trim().toUpperCase()
    const svgUrl = String(country?.flag?.svg ?? '').trim()

    if (!code || !svgUrl) {
      throw new Error(`Invalid country record: missing cca3/svg URL (${JSON.stringify(country)})`)
    }

    const fileName = `${code}.svg`
    const localPath = `/flags/${fileName}`
    const outputPath = path.join(flagsDir, fileName)

    if (!(await fileExists(outputPath))) {
      const svg = await downloadSvg(svgUrl, code)
      await writeFile(outputPath, svg, 'utf8')
      downloadedCount += 1
    }

    country.flag.svg = localPath
    country.flag.png = ''
  }

  const unresolvedSvg = countries.filter(country => String(country?.flag?.svg ?? '').includes('flagcdn.com'))
  const unresolvedPng = countries.filter(country => String(country?.flag?.png ?? '').includes('flagcdn.com'))

  if (unresolvedSvg.length || unresolvedPng.length) {
    throw new Error('flagcdn.com references remain after migration')
  }

  await writeFile(countriesPath, `${JSON.stringify(countries, null, 2)}\n`, 'utf8')

  console.log(`Countries processed: ${countries.length}`)
  console.log(`SVG files downloaded: ${downloadedCount}`)
  console.log('Done: flags now resolve from /public/flags using CCA3 filenames.')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
