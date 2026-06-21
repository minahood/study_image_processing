export type FreqParams = {
  type: 'lowpass' | 'highpass' | 'bandpass' | 'directional'
  sigma?: number
  angle?: number
  width?: number
  center?: number
  gain?: number
}

export function fft1d(re: Float64Array, im: Float64Array, inverse: boolean): void {
  const n = re.length
  for (let i = 1, j = 0; i < n; i++) {
    let bit = n >> 1
    for (; j & bit; bit >>= 1) j ^= bit
    j ^= bit
    if (i < j) {
      const tr = re[i]; re[i] = re[j]; re[j] = tr
      const ti = im[i]; im[i] = im[j]; im[j] = ti
    }
  }
  for (let len = 2; len <= n; len <<= 1) {
    const ang = (inverse ? 2 : -2) * Math.PI / len
    const wr = Math.cos(ang), wi = Math.sin(ang)
    for (let i = 0; i < n; i += len) {
      let cwr = 1, cwi = 0
      const half = len >> 1
      for (let k = 0; k < half; k++) {
        const a = i + k, b = i + k + half
        const vRe = re[b] * cwr - im[b] * cwi
        const vIm = re[b] * cwi + im[b] * cwr
        re[b] = re[a] - vRe; im[b] = im[a] - vIm
        re[a] = re[a] + vRe; im[a] = im[a] + vIm
        const ncwr = cwr * wr - cwi * wi; cwi = cwr * wi + cwi * wr; cwr = ncwr
      }
    }
  }
  if (inverse) { for (let i = 0; i < n; i++) { re[i] /= n; im[i] /= n } }
}

export function fft2d(re: Float64Array, im: Float64Array, n: number, inverse: boolean): void {
  const lr = new Float64Array(n), li = new Float64Array(n)
  for (let y = 0; y < n; y++) {
    const off = y * n
    for (let x = 0; x < n; x++) { lr[x] = re[off + x]; li[x] = im[off + x] }
    fft1d(lr, li, inverse)
    for (let x = 0; x < n; x++) { re[off + x] = lr[x]; im[off + x] = li[x] }
  }
  for (let x = 0; x < n; x++) {
    for (let y = 0; y < n; y++) { lr[y] = re[y * n + x]; li[y] = im[y * n + x] }
    fft1d(lr, li, inverse)
    for (let y = 0; y < n; y++) { re[y * n + x] = lr[y]; im[y * n + x] = li[y] }
  }
}

export function imageDataToGray(imageData: ImageData): Float64Array {
  const { data, width, height } = imageData
  const gray = new Float64Array(width * height)
  for (let i = 0, p = 0; i < data.length; i += 4, p++) {
    gray[p] = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]
  }
  return gray
}

export function maskVal(params: FreqParams, fu: number, fv: number): number {
  const r2 = fu * fu + fv * fv
  switch (params.type) {
    case 'lowpass': {
      const s = params.sigma ?? 16
      return Math.exp(-r2 / (2 * s * s))
    }
    case 'highpass': {
      const s = params.sigma ?? 14
      return 1 - Math.exp(-r2 / (2 * s * s))
    }
    case 'bandpass': {
      const s = params.sigma ?? 10, c = params.center ?? 38, r = Math.sqrt(r2)
      return Math.exp(-((r - c) * (r - c)) / (2 * s * s))
    }
    case 'directional': {
      const a = (params.angle ?? 45) * Math.PI / 180
      const perp = fu * Math.sin(a) - fv * Math.cos(a)
      const s = params.width ?? 5
      return Math.exp(-(perp * perp) / (2 * s * s))
    }
  }
}

export function applyFrequency(imageData: ImageData, params: FreqParams): ImageData {
  const N = imageData.width
  const gray = imageDataToGray(imageData)
  const re = new Float64Array(gray)
  const im = new Float64Array(N * N)
  fft2d(re, im, N, false)

  for (let y = 0; y < N; y++) {
    const fv = y < N / 2 ? y : y - N
    for (let x = 0; x < N; x++) {
      const fu = x < N / 2 ? x : x - N
      const m = maskVal(params, fu, fv)
      const idx = y * N + x
      re[idx] *= m; im[idx] *= m
    }
  }

  fft2d(re, im, N, true)

  const shift = params.type === 'highpass' || params.type === 'bandpass'
  const gain = params.gain ?? 1
  const out = new Uint8ClampedArray(N * N * 4)
  for (let p = 0; p < N * N; p++) {
    let v = re[p] * gain
    if (shift) v += 128
    v = v < 0 ? 0 : v > 255 ? 255 : v
    const o = p * 4
    out[o] = out[o + 1] = out[o + 2] = v; out[o + 3] = 255
  }
  return new ImageData(out, N, N)
}

export function patternGray(key: string, N: number): Float64Array {
  const T = Math.PI * 2
  const g = new Float64Array(N * N)
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      const i = y * N + x
      let v = 128
      switch (key) {
        case 'vstripe':    v = 128 + 120 * Math.cos(T * 16 * x / N); break
        case 'hstripe':    v = 128 + 120 * Math.cos(T * 16 * y / N); break
        case 'dstripe':    v = 128 + 120 * Math.cos(T * 16 * (x + y) / N); break
        case 'd135':       v = 128 + 120 * Math.cos(T * 16 * (x - y) / N); break
        case 'cross':      v = 128 + 60 * Math.cos(T * 14 * x / N) + 60 * Math.cos(T * 14 * y / N); break
        case 'checker':    v = 128 + 120 * Math.cos(T * 14 * x / N) * Math.cos(T * 14 * y / N); break
        case 'concentric': { const dx = x - N / 2, dy = y - N / 2, r = Math.sqrt(dx * dx + dy * dy); v = 128 + 120 * Math.cos(T * r / 12); break }
      }
      g[i] = v < 0 ? 0 : v > 255 ? 255 : v
    }
  }
  return g
}

export function patternSourceImage(key: string, N: number): ImageData {
  const g = patternGray(key, N)
  const out = new Uint8ClampedArray(N * N * 4)
  for (let i = 0; i < N * N; i++) {
    const v = Math.round(g[i]), o = i * 4
    out[o] = out[o + 1] = out[o + 2] = v; out[o + 3] = 255
  }
  return new ImageData(out, N, N)
}

export function powerSpectrumImage(gray: Float64Array, N: number): ImageData {
  const re = new Float64Array(gray)
  const im = new Float64Array(N * N)
  fft2d(re, im, N, false)

  const mags = new Float64Array(N * N)
  for (let i = 0; i < N * N; i++) {
    mags[i] = Math.log(1 + Math.hypot(re[i], im[i]))
  }

  // Normalize excluding DC window (radius DCR)
  const DCR = 3
  let max = 1e-9
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      const fx = Math.min(x, N - x), fy = Math.min(y, N - y)
      if (fx <= DCR && fy <= DCR) continue
      const m = mags[y * N + x]
      if (m > max) max = m
    }
  }

  // fftshift + gamma 0.7
  const half = N / 2
  const valg = new Float64Array(N * N)
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      const sy = (y + half) % N, sx = (x + half) % N
      const norm = Math.min(1, mags[sy * N + sx] / max)
      valg[y * N + x] = Math.pow(norm, 0.7) * 255
    }
  }

  // 3x3 max-dilation
  const out = new Uint8ClampedArray(N * N * 4)
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      let m = 0
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const ny = y + dy, nx = x + dx
          if (ny < 0 || ny >= N || nx < 0 || nx >= N) continue
          const vv = valg[ny * N + nx]; if (vv > m) m = vv
        }
      }
      const v = m > 255 ? 255 : m, o = (y * N + x) * 4
      out[o] = out[o + 1] = out[o + 2] = v; out[o + 3] = 255
    }
  }
  return new ImageData(out, N, N)
}

// Real-image key → real image name mapping for spectrum questions
export const FOURIER_REAL_MAP: Record<string, string> = {
  hex: 'blue_kikagaku',
  metal: 'metal',
  fence: 'fence',
  pebbles: 'pebbles',
  shapes: 'shapes',
}

export const SYNTHETIC_PATTERNS = new Set([
  'vstripe', 'hstripe', 'dstripe', 'd135', 'cross', 'checker', 'concentric',
])
