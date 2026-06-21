import { useState, useEffect, useRef } from 'react'
import { loadImage, isRealImage, realImagePath } from '../processors/imageLoader'

const BG = '#fcfbf8'
const BORDER = '1.5px solid #1a1a1c'
const ACCENT = '#e0411c'
const MUTED = '#9a9aa0'
const MONO = "'JetBrains Mono', monospace"

const IMAGES = ['momiji', 'bud', 'summer', 'shapes', 'blue_kikagaku', 'fence', 'metal', 'pebbles']
const SIZE = 240

type Mat = number[][] // 3x3

const IDENTITY: Mat = [[1, 0, 0], [0, 1, 0], [0, 0, 1]]

function multiply(a: Mat, b: Mat): Mat {
  const r: Mat = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]
  for (let i = 0; i < 3; i++)
    for (let j = 0; j < 3; j++)
      for (let k = 0; k < 3; k++)
        r[i][j] += a[i][k] * b[k][j]
  return r
}

function invert3(m: Mat): Mat | null {
  const [a, b, c] = m[0]
  const [d, e, f] = m[1]
  const [g, h, i] = m[2]
  const A = e * i - f * h
  const B = -(d * i - f * g)
  const Cc = d * h - e * g
  const det = a * A + b * B + c * Cc
  if (Math.abs(det) < 1e-9) return null
  const inv = 1 / det
  return [
    [A * inv, (c * h - b * i) * inv, (b * f - c * e) * inv],
    [B * inv, (a * i - c * g) * inv, (c * d - a * f) * inv],
    [Cc * inv, (b * g - a * h) * inv, (a * e - b * d) * inv],
  ]
}

function detLinear(m: Mat): number {
  return m[0][0] * m[1][1] - m[0][1] * m[1][0]
}

type Props = { onBack: () => void }

const PRESETS: { label: string; mat: Mat }[] = [
  { label: '単位行列', mat: IDENTITY },
  { label: '回転90°', mat: [[0, -1, 0], [1, 0, 0], [0, 0, 1]] },
  { label: '拡大', mat: [[1.5, 0, 0], [0, 1.5, 0], [0, 0, 1]] },
  { label: '縮小', mat: [[0.5, 0, 0], [0, 0.5, 0], [0, 0, 1]] },
  { label: '平行移動', mat: [[1, 0, 40], [0, 1, 40], [0, 0, 1]] },
  { label: '反転X', mat: [[-1, 0, 0], [0, 1, 0], [0, 0, 1]] },
]

function MatrixEditor({ name, mat, onChange }: { name: string; mat: Mat; onChange: (m: Mat) => void }) {
  return (
    <div>
      <div style={{ fontSize: '0.8rem', marginBottom: 4 }}>{name}</div>
      <table style={{ borderCollapse: 'collapse' }}>
        <tbody>
          {mat.map((row, ri) => (
            <tr key={ri}>
              {row.map((val, ci) => (
                <td key={ci} style={{ padding: 2 }}>
                  <input
                    type="number"
                    value={val}
                    step="any"
                    onChange={e => {
                      const num = parseFloat(e.target.value)
                      const next = mat.map(r => [...r])
                      next[ri][ci] = isNaN(num) ? 0 : num
                      onChange(next)
                    }}
                    style={{ width: 56, height: 36, textAlign: 'center', border: BORDER, fontFamily: MONO, padding: 0 }}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function GeometricPlayground({ onBack }: Props) {
  const [selectedImage, setSelectedImage] = useState('momiji')
  const [sourceData, setSourceData] = useState<ImageData | null>(null)
  const [R, setR] = useState<Mat>(IDENTITY.map(r => [...r]))
  const [M, setM] = useState<Mat>(IDENTITY.map(r => [...r]))
  // sliders that set R
  const [rotation, setRotation] = useState(0)
  const [scale, setScale] = useState(1)
  const [tx, setTx] = useState(0)
  const [ty, setTy] = useState(0)
  const beforeRef = useRef<HTMLCanvasElement>(null)
  const afterRef = useRef<HTMLCanvasElement>(null)

  const composed = multiply(R, M)

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

  // sliders -> R
  useEffect(() => {
    const rad = (rotation * Math.PI) / 180
    const cos = Math.cos(rad), sin = Math.sin(rad)
    setR([
      [scale * cos, -scale * sin, tx],
      [scale * sin, scale * cos, ty],
      [0, 0, 1],
    ])
  }, [rotation, scale, tx, ty])

  useEffect(() => {
    if (!sourceData || !beforeRef.current) return
    const off = document.createElement('canvas')
    off.width = sourceData.width; off.height = sourceData.height
    off.getContext('2d')!.putImageData(sourceData, 0, 0)
    const ctx = beforeRef.current.getContext('2d')!
    ctx.clearRect(0, 0, SIZE, SIZE)
    ctx.drawImage(off, 0, 0, SIZE, SIZE)
  }, [sourceData])

  useEffect(() => {
    if (!sourceData || !afterRef.current) return
    const { width: w, height: h, data: src } = sourceData
    const out = new Uint8ClampedArray(src.length)
    const inv = invert3(composed)
    const cx = w / 2, cy = h / 2
    if (inv) {
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          // center-based mapping
          const dx = x - cx, dy = y - cy
          const sx = inv[0][0] * dx + inv[0][1] * dy + inv[0][2] + cx
          const sy = inv[1][0] * dx + inv[1][1] * dy + inv[1][2] + cy
          const nx = Math.round(sx), ny = Math.round(sy)
          const di = (y * w + x) * 4
          if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
            const si = (ny * w + nx) * 4
            out[di] = src[si]; out[di + 1] = src[si + 1]; out[di + 2] = src[si + 2]; out[di + 3] = src[si + 3]
          } else {
            out[di + 3] = 0
          }
        }
      }
    }
    const id = new ImageData(out, w, h)
    const off = document.createElement('canvas')
    off.width = w; off.height = h
    off.getContext('2d')!.putImageData(id, 0, 0)
    const ctx = afterRef.current.getContext('2d')!
    ctx.clearRect(0, 0, SIZE, SIZE)
    ctx.drawImage(off, 0, 0, SIZE, SIZE)
  }, [sourceData, R, M])

  function applyPreset(mat: Mat) {
    setR(mat.map(r => [...r]))
    setRotation(0); setScale(1); setTx(0); setTy(0)
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
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '1.5rem', background: BG, fontFamily: MONO, color: '#1a1a1c', minHeight: '100vh' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <button onClick={onBack} style={{ background: BG, border: BORDER, padding: '0.4rem 0.8rem', cursor: 'pointer', fontFamily: MONO }}>← 戻る</button>
        <h2 style={{ margin: 0, fontSize: '1.2rem' }}>⊞ 幾何学変換（行列）</h2>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {IMAGES.map(v => <button key={v} onClick={() => setSelectedImage(v)} style={chip(selectedImage === v)}>{v}</button>)}
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        <figure style={{ margin: 0, textAlign: 'center' }}>
          <figcaption style={{ fontSize: '0.75rem', color: MUTED, marginBottom: 4 }}>変換前</figcaption>
          <canvas ref={beforeRef} width={SIZE} height={SIZE} style={{ border: BORDER, display: 'block' }} />
        </figure>
        <figure style={{ margin: 0, textAlign: 'center' }}>
          <figcaption style={{ fontSize: '0.75rem', color: MUTED, marginBottom: 4 }}>変換後（R·M）</figcaption>
          <canvas ref={afterRef} width={SIZE} height={SIZE} style={{ border: BORDER, display: 'block' }} />
        </figure>
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <MatrixEditor name="R" mat={R} onChange={setR} />
        <MatrixEditor name="M" mat={M} onChange={setM} />
        <div>
          <div style={{ fontSize: '0.8rem', marginBottom: 4 }}>R·M（合成）</div>
          <table style={{ borderCollapse: 'collapse' }}>
            <tbody>
              {composed.map((row, ri) => (
                <tr key={ri}>
                  {row.map((val, ci) => (
                    <td key={ci} style={{ width: 56, height: 36, textAlign: 'center', border: BORDER, fontSize: '0.75rem' }}>
                      {val.toFixed(2)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ fontSize: '0.8rem', marginTop: 6 }}>det(線形部) = {detLinear(composed).toFixed(3)}</div>
        </div>
      </div>

      <div style={{ marginBottom: '1.5rem', maxWidth: 400 }}>
        <div style={{ fontSize: '0.75rem', color: MUTED, marginBottom: 6 }}>Rを設定するスライダー</div>
        <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: 6 }}>
          回転 {rotation}°
          <input type="range" min={-180} max={180} value={rotation} onChange={e => setRotation(Number(e.target.value))} style={{ width: '100%', accentColor: ACCENT }} />
        </label>
        <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: 6 }}>
          拡大率 {scale.toFixed(2)}
          <input type="range" min={0.2} max={3} step={0.05} value={scale} onChange={e => setScale(Number(e.target.value))} style={{ width: '100%', accentColor: ACCENT }} />
        </label>
        <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: 6 }}>
          tx {tx}
          <input type="range" min={-120} max={120} value={tx} onChange={e => setTx(Number(e.target.value))} style={{ width: '100%', accentColor: ACCENT }} />
        </label>
        <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: 6 }}>
          ty {ty}
          <input type="range" min={-120} max={120} value={ty} onChange={e => setTy(Number(e.target.value))} style={{ width: '100%', accentColor: ACCENT }} />
        </label>
      </div>

      <div>
        <div style={{ fontSize: '0.75rem', color: MUTED, marginBottom: 6 }}>プリセット（Rに適用）</div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {PRESETS.map(p => <button key={p.label} onClick={() => applyPreset(p.mat)} style={chip(false)}>{p.label}</button>)}
        </div>
      </div>
    </div>
  )
}
