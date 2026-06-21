import { useState, useEffect, useRef } from 'react'
import { loadImage, isRealImage, realImagePath } from '../processors/imageLoader'

const BG = '#fcfbf8'
const BORDER = '1.5px solid #1a1a1c'
const ACCENT = '#e0411c'
const MUTED = '#9a9aa0'
const MONO = "'JetBrains Mono', monospace"

const IMAGES = ['momiji', 'bud', 'summer', 'shapes', 'blue_kikagaku', 'fence', 'metal', 'pebbles']
const SIZE = 240
const C = 300

type Pt = { x: number; y: number } // 0-255 input, 0-255 output
type Channel = 'ALL' | 'R' | 'G' | 'B'

const PRESETS: { label: string; points: Pt[] }[] = [
  { label: '標準', points: [{ x: 0, y: 0 }, { x: 255, y: 255 }] },
  { label: '明るく', points: [{ x: 0, y: 40 }, { x: 128, y: 180 }, { x: 255, y: 255 }] },
  { label: '暗く', points: [{ x: 0, y: 0 }, { x: 128, y: 75 }, { x: 255, y: 215 }] },
  { label: 'Sコントラスト', points: [{ x: 0, y: 0 }, { x: 64, y: 40 }, { x: 192, y: 215 }, { x: 255, y: 255 }] },
  { label: '低コントラスト', points: [{ x: 0, y: 50 }, { x: 255, y: 205 }] },
  { label: '反転', points: [{ x: 0, y: 255 }, { x: 255, y: 0 }] },
]

function buildLUT(points: Pt[]): Uint8ClampedArray {
  const pts = [...points].sort((a, b) => a.x - b.x)
  const lut = new Uint8ClampedArray(256)
  for (let i = 0; i < 256; i++) {
    let j = 0
    while (j < pts.length - 1 && pts[j + 1].x < i) j++
    const a = pts[j]
    const b = pts[Math.min(j + 1, pts.length - 1)]
    let y: number
    if (b.x === a.x) y = a.y
    else y = a.y + ((b.y - a.y) * (i - a.x)) / (b.x - a.x)
    lut[i] = Math.max(0, Math.min(255, Math.round(y)))
  }
  return lut
}

type Props = { onBack: () => void }

export default function ToneCurvePlayground({ onBack }: Props) {
  const [selectedImage, setSelectedImage] = useState('momiji')
  const [channel, setChannel] = useState<Channel>('ALL')
  const [points, setPoints] = useState<Pt[]>([{ x: 0, y: 0 }, { x: 255, y: 255 }])
  const [sourceData, setSourceData] = useState<ImageData | null>(null)
  const sourceCanvasRef = useRef<HTMLCanvasElement>(null)
  const resultCanvasRef = useRef<HTMLCanvasElement>(null)
  const curveCanvasRef = useRef<HTMLCanvasElement>(null)
  const dragRef = useRef<number | null>(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      const img = await loadImage(realImagePath(selectedImage), SIZE, SIZE)
      if (cancelled || !isRealImage(selectedImage)) return
      setSourceData(img)
    }
    load()
    return () => { cancelled = true }
  }, [selectedImage])

  useEffect(() => {
    if (!sourceData || !sourceCanvasRef.current) return
    const off = document.createElement('canvas')
    off.width = sourceData.width; off.height = sourceData.height
    off.getContext('2d')!.putImageData(sourceData, 0, 0)
    const ctx = sourceCanvasRef.current.getContext('2d')!
    ctx.clearRect(0, 0, SIZE, SIZE)
    ctx.drawImage(off, 0, 0, SIZE, SIZE)
  }, [sourceData])

  useEffect(() => {
    if (!sourceData || !resultCanvasRef.current) return
    const lut = buildLUT(points)
    const out = new Uint8ClampedArray(sourceData.data)
    for (let i = 0; i < out.length; i += 4) {
      if (channel === 'ALL' || channel === 'R') out[i] = lut[out[i]]
      if (channel === 'ALL' || channel === 'G') out[i + 1] = lut[out[i + 1]]
      if (channel === 'ALL' || channel === 'B') out[i + 2] = lut[out[i + 2]]
    }
    const id = new ImageData(out, sourceData.width, sourceData.height)
    const off = document.createElement('canvas')
    off.width = id.width; off.height = id.height
    off.getContext('2d')!.putImageData(id, 0, 0)
    const ctx = resultCanvasRef.current.getContext('2d')!
    ctx.clearRect(0, 0, SIZE, SIZE)
    ctx.drawImage(off, 0, 0, SIZE, SIZE)
  }, [sourceData, points, channel])

  useEffect(() => {
    if (!curveCanvasRef.current) return
    const ctx = curveCanvasRef.current.getContext('2d')!
    ctx.clearRect(0, 0, C, C)
    ctx.fillStyle = BG
    ctx.fillRect(0, 0, C, C)
    ctx.strokeStyle = '#ddd'
    ctx.lineWidth = 1
    for (let i = 1; i < 4; i++) {
      const p = (C / 4) * i
      ctx.beginPath(); ctx.moveTo(p, 0); ctx.lineTo(p, C); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(0, p); ctx.lineTo(C, p); ctx.stroke()
    }
    const lut = buildLUT(points)
    ctx.strokeStyle = '#1a1a1c'
    ctx.lineWidth = 2
    ctx.beginPath()
    for (let i = 0; i < 256; i++) {
      const px = (i / 255) * C
      const py = C - (lut[i] / 255) * C
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py)
    }
    ctx.stroke()
    ctx.fillStyle = ACCENT
    for (const p of points) {
      const px = (p.x / 255) * C
      const py = C - (p.y / 255) * C
      ctx.beginPath(); ctx.arc(px, py, 5, 0, Math.PI * 2); ctx.fill()
    }
  }, [points])

  function eventToPt(clientX: number, clientY: number): Pt {
    const rect = curveCanvasRef.current!.getBoundingClientRect()
    const x = ((clientX - rect.left) / rect.width) * 255
    const y = (1 - (clientY - rect.top) / rect.height) * 255
    return { x: Math.max(0, Math.min(255, Math.round(x))), y: Math.max(0, Math.min(255, Math.round(y))) }
  }

  function onDown(e: React.MouseEvent) {
    const pt = eventToPt(e.clientX, e.clientY)
    let nearest = -1, best = 20
    points.forEach((p, i) => {
      const px = (p.x / 255) * C, py = C - (p.y / 255) * C
      const ex = (pt.x / 255) * C, ey = C - (pt.y / 255) * C
      const d = Math.hypot(px - ex, py - ey)
      if (d < best) { best = d; nearest = i }
    })
    if (nearest >= 0) {
      dragRef.current = nearest
    } else {
      const next = [...points, pt].sort((a, b) => a.x - b.x)
      setPoints(next)
      dragRef.current = next.findIndex(p => p === pt)
    }
  }

  function onMove(e: React.MouseEvent) {
    if (dragRef.current === null) return
    const pt = eventToPt(e.clientX, e.clientY)
    const next = points.map((p, i) => (i === dragRef.current ? pt : p))
    setPoints(next)
  }

  function onUp() { dragRef.current = null }

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
        <h2 style={{ margin: 0, fontSize: '1.2rem' }}>⟋ トーンカーブ</h2>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
        {IMAGES.map(v => <button key={v} onClick={() => setSelectedImage(v)} style={chip(selectedImage === v)}>{v}</button>)}
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {(['ALL', 'R', 'G', 'B'] as Channel[]).map(c => <button key={c} onClick={() => setChannel(c)} style={chip(channel === c)}>{c}</button>)}
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: '0.75rem', color: MUTED, marginBottom: 4 }}>トーンカーブ（クリックで点追加・ドラッグで移動）</div>
          <canvas
            ref={curveCanvasRef}
            width={C}
            height={C}
            style={{ border: BORDER, display: 'block', cursor: 'crosshair' }}
            onMouseDown={onDown}
            onMouseMove={onMove}
            onMouseUp={onUp}
            onMouseLeave={onUp}
          />
        </div>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <figure style={{ margin: 0, textAlign: 'center' }}>
            <figcaption style={{ fontSize: '0.75rem', color: MUTED, marginBottom: 4 }}>元画像</figcaption>
            <canvas ref={sourceCanvasRef} width={SIZE} height={SIZE} style={{ border: BORDER, display: 'block' }} />
          </figure>
          <figure style={{ margin: 0, textAlign: 'center' }}>
            <figcaption style={{ fontSize: '0.75rem', color: MUTED, marginBottom: 4 }}>適用後</figcaption>
            <canvas ref={resultCanvasRef} width={SIZE} height={SIZE} style={{ border: BORDER, display: 'block' }} />
          </figure>
        </div>
      </div>

      <div style={{ marginTop: '1.5rem' }}>
        <div style={{ fontSize: '0.75rem', color: MUTED, marginBottom: 6 }}>プリセット</div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {PRESETS.map(p => (
            <button key={p.label} onClick={() => setPoints(p.points.map(pt => ({ ...pt })))} style={chip(false)}>{p.label}</button>
          ))}
        </div>
      </div>
    </div>
  )
}
