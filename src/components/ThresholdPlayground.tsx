import { useState, useEffect, useRef } from 'react'
import { loadImage, isRealImage, realImagePath } from '../processors/imageLoader'

const BG = '#fcfbf8'
const BORDER = '1.5px solid #1a1a1c'
const ACCENT = '#e0411c'
const MUTED = '#9a9aa0'
const MONO = "'JetBrains Mono', monospace"

const IMAGES = ['momiji', 'bud', 'summer', 'shapes', 'blue_kikagaku', 'fence', 'metal', 'pebbles']

const SIZE = 240
const HIST_W = 256
const HIST_H = 120

function toGray(data: ImageData): Uint8ClampedArray {
  const g = new Uint8ClampedArray(data.width * data.height)
  for (let i = 0; i < g.length; i++) {
    const o = i * 4
    g[i] = Math.round(0.299 * data.data[o] + 0.587 * data.data[o + 1] + 0.114 * data.data[o + 2])
  }
  return g
}

function histogram(gray: Uint8ClampedArray): number[] {
  const h = new Array(256).fill(0)
  for (let i = 0; i < gray.length; i++) h[gray[i]]++
  return h
}

function otsu(hist: number[], total: number): number {
  let sum = 0
  for (let i = 0; i < 256; i++) sum += i * hist[i]
  let sumB = 0, wB = 0, maxVar = -1, threshold = 0
  for (let t = 0; t < 256; t++) {
    wB += hist[t]
    if (wB === 0) continue
    const wF = total - wB
    if (wF === 0) break
    sumB += t * hist[t]
    const mB = sumB / wB
    const mF = (sum - sumB) / wF
    const between = wB * wF * (mB - mF) * (mB - mF)
    if (between > maxVar) { maxVar = between; threshold = t }
  }
  return threshold
}

type Props = { onBack: () => void }

export default function ThresholdPlayground({ onBack }: Props) {
  const [selectedImage, setSelectedImage] = useState('momiji')
  const [sourceData, setSourceData] = useState<ImageData | null>(null)
  const [threshold, setThreshold] = useState(128)
  const [invert, setInvert] = useState(false)
  const sourceCanvasRef = useRef<HTMLCanvasElement>(null)
  const resultCanvasRef = useRef<HTMLCanvasElement>(null)
  const histCanvasRef = useRef<HTMLCanvasElement>(null)
  const [gray, setGray] = useState<Uint8ClampedArray | null>(null)
  const [hist, setHist] = useState<number[]>([])
  const [whitePct, setWhitePct] = useState(0)
  const draggingRef = useRef(false)

  useEffect(() => {
    let cancelled = false
    async function load() {
      const img = await loadImage(realImagePath(selectedImage), SIZE, SIZE)
      if (cancelled || !isRealImage(selectedImage)) return
      setSourceData(img)
      const g = toGray(img)
      setGray(g)
      setHist(histogram(g))
    }
    load()
    return () => { cancelled = true }
  }, [selectedImage])

  // draw grayscale source
  useEffect(() => {
    if (!gray || !sourceData || !sourceCanvasRef.current) return
    const out = new Uint8ClampedArray(sourceData.data.length)
    for (let i = 0; i < gray.length; i++) {
      const o = i * 4
      out[o] = out[o + 1] = out[o + 2] = gray[i]
      out[o + 3] = 255
    }
    const id = new ImageData(out, sourceData.width, sourceData.height)
    const off = document.createElement('canvas')
    off.width = id.width; off.height = id.height
    off.getContext('2d')!.putImageData(id, 0, 0)
    const ctx = sourceCanvasRef.current.getContext('2d')!
    ctx.clearRect(0, 0, SIZE, SIZE)
    ctx.drawImage(off, 0, 0, SIZE, SIZE)
  }, [gray, sourceData])

  // draw binary result
  useEffect(() => {
    if (!gray || !sourceData || !resultCanvasRef.current) return
    const out = new Uint8ClampedArray(sourceData.data.length)
    let white = 0
    for (let i = 0; i < gray.length; i++) {
      let on = gray[i] >= threshold
      if (invert) on = !on
      const v = on ? 255 : 0
      if (v === 255) white++
      const o = i * 4
      out[o] = out[o + 1] = out[o + 2] = v
      out[o + 3] = 255
    }
    setWhitePct((white / gray.length) * 100)
    const id = new ImageData(out, sourceData.width, sourceData.height)
    const off = document.createElement('canvas')
    off.width = id.width; off.height = id.height
    off.getContext('2d')!.putImageData(id, 0, 0)
    const ctx = resultCanvasRef.current.getContext('2d')!
    ctx.clearRect(0, 0, SIZE, SIZE)
    ctx.drawImage(off, 0, 0, SIZE, SIZE)
  }, [gray, sourceData, threshold, invert])

  // draw histogram
  useEffect(() => {
    if (!histCanvasRef.current || hist.length === 0) return
    const ctx = histCanvasRef.current.getContext('2d')!
    ctx.clearRect(0, 0, HIST_W, HIST_H)
    ctx.fillStyle = BG
    ctx.fillRect(0, 0, HIST_W, HIST_H)
    const max = Math.max(...hist)
    ctx.fillStyle = '#1a1a1c'
    for (let i = 0; i < 256; i++) {
      const h = max > 0 ? (hist[i] / max) * HIST_H : 0
      ctx.fillRect(i, HIST_H - h, 1, h)
    }
    ctx.strokeStyle = ACCENT
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(threshold, 0)
    ctx.lineTo(threshold, HIST_H)
    ctx.stroke()
  }, [hist, threshold])

  function histThreshold(clientX: number) {
    const rect = histCanvasRef.current!.getBoundingClientRect()
    const x = Math.round(((clientX - rect.left) / rect.width) * 256)
    setThreshold(Math.max(0, Math.min(255, x)))
  }

  function runOtsu() {
    if (!gray) return
    setThreshold(otsu(hist, gray.length))
  }

  const chip = (active: boolean): React.CSSProperties => ({
    padding: '0.35rem 0.7rem',
    border: active ? `1.5px solid ${ACCENT}` : BORDER,
    background: active ? ACCENT : BG,
    color: active ? '#fff' : '#1a1a1c',
    fontFamily: MONO,
    fontSize: '0.8rem',
    cursor: 'pointer',
  })

  return (
    <div style={{ maxWidth: 820, margin: '0 auto', padding: '1.5rem', background: BG, fontFamily: MONO, color: '#1a1a1c', minHeight: '100vh' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <button onClick={onBack} style={{ background: BG, border: BORDER, padding: '0.4rem 0.8rem', cursor: 'pointer', fontFamily: MONO }}>← 戻る</button>
        <h2 style={{ margin: 0, fontSize: '1.2rem' }}>◧ 二値化プレイグラウンド</h2>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {IMAGES.map(v => (
          <button key={v} onClick={() => setSelectedImage(v)} style={chip(selectedImage === v)}>{v}</button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        <figure style={{ margin: 0, textAlign: 'center' }}>
          <figcaption style={{ fontSize: '0.75rem', color: MUTED, marginBottom: 4 }}>グレースケール</figcaption>
          <canvas ref={sourceCanvasRef} width={SIZE} height={SIZE} style={{ border: BORDER, display: 'block' }} />
        </figure>
        <figure style={{ margin: 0, textAlign: 'center' }}>
          <figcaption style={{ fontSize: '0.75rem', color: MUTED, marginBottom: 4 }}>二値化結果</figcaption>
          <canvas ref={resultCanvasRef} width={SIZE} height={SIZE} style={{ border: BORDER, display: 'block' }} />
        </figure>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <div style={{ fontSize: '0.75rem', color: MUTED, marginBottom: 4 }}>ヒストグラム（赤線をドラッグ）</div>
        <canvas
          ref={histCanvasRef}
          width={HIST_W}
          height={HIST_H}
          style={{ border: BORDER, display: 'block', cursor: 'ew-resize', width: HIST_W, height: HIST_H }}
          onMouseDown={e => { draggingRef.current = true; histThreshold(e.clientX) }}
          onMouseMove={e => { if (draggingRef.current) histThreshold(e.clientX) }}
          onMouseUp={() => { draggingRef.current = false }}
          onMouseLeave={() => { draggingRef.current = false }}
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.85rem' }}>閾値: {threshold}</span>
        <input type="range" min={0} max={255} value={threshold} onChange={e => setThreshold(Number(e.target.value))} style={{ flex: 1, minWidth: 200, accentColor: ACCENT }} />
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <button onClick={runOtsu} style={chip(false)}>⊙ 大津法で自動</button>
        <button onClick={() => setInvert(v => !v)} style={chip(invert)}>⇄ 白黒反転</button>
      </div>

      <div style={{ fontSize: '0.85rem', color: '#1a1a1c' }}>
        白: {whitePct.toFixed(1)}% / 黒: {(100 - whitePct).toFixed(1)}%
      </div>
    </div>
  )
}
