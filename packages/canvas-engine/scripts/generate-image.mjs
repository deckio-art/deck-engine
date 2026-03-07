#!/usr/bin/env node
/**
 * Generate an image using OpenAI chatgpt-image-latest (Image API) and save
 * it for use in slides.
 *
 * Requires OPENAI_API_KEY environment variable.
 *
 * Usage:
 *   node scripts/generate-image.mjs --prompt "a bridge icon" --name bridge-icon
 *   node scripts/generate-image.mjs --prompt "..." --name hero --size 1536x1024
 *   node scripts/generate-image.mjs --prompt "..." --name icon --quality high
 *   node scripts/generate-image.mjs --prompt "..." --name x --model gpt-image-1.5
 */
import { writeFileSync, mkdirSync, readFileSync, existsSync } from 'fs'
import path from 'path'

const root = process.cwd()
const args = process.argv.slice(2)
const arg = (name, fb) => {
  const i = args.indexOf(`--${name}`)
  return i !== -1 && args[i + 1] ? args[i + 1] : fb
}

const outputDir = arg('out-dir', path.join('src', 'data', 'generated'))
const imagesDir = path.resolve(root, outputDir)
const envPath = path.join(root, '.env')

if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, 'utf-8').split(/\r?\n/)) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.+)$/)
    if (m) process.env[m[1]] = m[2].trim()
  }
}

const PROMPT = arg('prompt', null)
const NAME = arg('name', null)
const SIZE = arg('size', '1024x1024')
const QUALITY = arg('quality', 'auto')
const MODEL = arg('model', 'chatgpt-image-latest')

const API_KEY = process.env.OPENAI_API_KEY
if (!API_KEY) {
  console.error('❌ Set OPENAI_API_KEY environment variable')
  process.exit(1)
}
if (!PROMPT) {
  console.error('❌ --prompt is required')
  process.exit(1)
}
if (!NAME) {
  console.error('❌ --name is required (used as filename)')
  process.exit(1)
}

async function main() {
  mkdirSync(imagesDir, { recursive: true })
  console.log(`🎨 Generating image: "${PROMPT}"`)
  console.log(`   Model: ${MODEL}  Size: ${SIZE}  Quality: ${QUALITY}`)

  const body = {
    model: MODEL,
    prompt: PROMPT,
    n: 1,
    size: SIZE,
    quality: QUALITY,
  }

  const res = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const err = await res.text()
    console.error(`❌ API error (${res.status}): ${err}`)
    process.exit(1)
  }

  const data = await res.json()
  const imageB64 = data.data?.[0]?.b64_json || null
  const imageUrl = data.data?.[0]?.url || null

  if (!imageB64 && !imageUrl) {
    console.error('❌ Could not extract image from response.')
    console.error(JSON.stringify(data).slice(0, 2000))
    process.exit(1)
  }

  const filepath = path.join(imagesDir, `${NAME}.png`)
  let imgBuffer
  if (imageB64) {
    imgBuffer = Buffer.from(imageB64, 'base64')
  } else {
    const dl = await fetch(imageUrl)
    imgBuffer = Buffer.from(await dl.arrayBuffer())
  }
  writeFileSync(filepath, imgBuffer)
  console.log(`📸 Saved: ${path.relative(root, filepath)}`)
  console.log(`\n📦 Import in a slide:`)
  console.log(`   import ${NAME}Img from '../../data/generated/${NAME}.png'`)
}

main().catch(err => {
  console.error('❌', err?.message || err)
  process.exit(1)
})
