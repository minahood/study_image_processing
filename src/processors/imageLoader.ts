const cache = new Map<string, ImageData>()

export async function loadImage(path: string, width = 200, height = 200): Promise<ImageData> {
  const key = `${path}:${width}x${height}`
  if (cache.has(key)) return cache.get(key)!

  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')!

      // Center crop: scale to fill, then crop to center
      const scale = Math.max(width / img.width, height / img.height)
      const sw = width / scale
      const sh = height / scale
      const sx = (img.width - sw) / 2
      const sy = (img.height - sh) / 2
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, width, height)

      const imageData = ctx.getImageData(0, 0, width, height)
      cache.set(key, imageData)
      resolve(imageData)
    }
    img.onerror = reject
    img.src = path
  })
}

export function isRealImage(type: string): boolean {
  return ['bud', 'momiji', 'summer', 'shapes', 'blue_kikagaku'].includes(type)
}

export function realImagePath(type: string): string {
  return `/study_image_processing/images/${type}.jpg`
}
