import { useState, useEffect, useRef, useCallback } from 'react'
import { loadImage, realImagePath } from '../processors/imageLoader'
import { fft2d, imageDataToGray } from '../processors/fft'

type Props = { onBack: () => void }

const IMAGE_OPTIONS = [
  { value: 'momiji',        label: '紅葉' },
  { value: 'bud',           label: '新芽' },
  { value: 'summer',        label: 'サマービーチ' },
  { value: 'shapes',        label: '図形' },
  { value: 'blue_kikagaku', label: '幾何学模様' },
  { value: 'fence',         label: '金網' },
  { value: 'metal',         label: '金属' },
  { value: 'pebbles',       label: '小石' },
]

const N = 256

type DrawMode = 'draw' | 'filter'
type BrushShape = 'circle' | 'square'
type BrushValue = 'white' | 'black'

const CHIP = (active: boolean): React.CSSProperties => ({
  padding: '4px 10px',
  border: '1.5px solid #1a1a1c',
  background: active ? '#1a1a1c' : '#fcfbf8',
  color: active ? '#fcfbf8' : '#1a1a1c',
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: '11px',
  fontWeight: 700,
  cursor: 'pointer',
  userSelect: 'none',
})

const PRESETS = [
  { label: 'ローパス（中心付近を保持）', buildMask: (mask: Float64Array) => {
    const sigma = 30
    for (let y = 0; y < N; y++) {
      const fv = y < N/2 ? y : y - N
      for (let x = 0; x < N; x++) {
        const fu = x < N/2 ? x : x - N
        mask[y * N + x] = Math.exp(-(fu*fu + fv*fv) / (2*sigma*sigma))
      }
    }
  }},
  { label: 'ハイパス（輪郭を強調）', buildMask: (mask: Float64Array) => {
    const sigma = 20
    for (let y = 0; y < N; y++) {
      const fv = y < N/2 ? y : y - N
      for (let x = 0; x < N; x++) {
        const fu = x < N/2 ? x : x - N
        mask[y * N + x] = 1 - Math.exp(-(fu*fu + fv*fv) / (2*sigma*sigma))
      }
    }
  }},
  { label: '縦縞除去（水平帯をゼロに）', buildMask: (mask: Float64Array) => {
    mask.fill(1)
    for (let y = 0; y < N; y++) {
      const fv = y < N/2 ? y : y - N
      if (Math.abs(fv) < 6) {
        for (let x = 0; x < N; x++) mask[y * N + x] = 0
      }
    }
  }},
  { label: 'リセット（全通過）', buildMask: (mask: Float64Array) => { mask.fill(1) } },
]

export default function FourierPlayground({ onBack }: Props) {
  const [selectedImage, setSelectedImage] = useState('momiji')
  const [drawMode, setDrawMode] = useState<DrawMode>('draw')
  const [brushValue, setBrushValue] = useState<BrushValue>('black')
  const [brushShape, setBrushShape] = useState<BrushShape>('circle')
  const [brushSize, setBrushSize] = useState(3)

  const sourceCanvasRef = useRef<HTMLCanvasElement>(null)
  const spectrumCanvasRef = useRef<HTMLCanvasElement>(null)
  const resultCanvasRef = useRef<HTMLCanvasElement>(null)

  // FFT state (mutable refs to avoid re-render on every pixel)
  const fftRe = useRef<Float64Array>(new Float64Array(N * N))
  const fftIm = useRef<Float64Array>(new Float64Array(N * N))
  const mask = useRef<Float64Array>(new Float64Array(N * N).fill(1))
  const drawing = useRef(false)

  // Draw spectrum canvas from current FFT + mask
  const drawSpectrum = useCallback(() => {
    const canvas = spectrumCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const re = fftRe.current, im = fftIm.current, msk = mask.current

    // Log magnitude, fftshift, masked display
    const mags = new Float64Array(N * N)
    for (let i = 0; i < N * N; i++) mags[i] = Math.log(1 + Math.hypot(re[i], im[i]))
    const half = N / 2
    const DCR = 3
    let maxM = 1e-9
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
      const fx = Math.min(x, N - x), fy = Math.min(y, N - y)
      if (fx <= DCR && fy <= DCR) continue
      if (mags[y * N + x] > maxM) maxM = mags[y * N + x]
    }

    const imgData = ctx.createImageData(N, N)
    const d = imgData.data
    for (let y = 0; y < N; y++) {
      for (let x = 0; x < N; x++) {
        const sy = (y + half) % N, sx = (x + half) % N
        const norm = Math.min(1, mags[sy * N + sx] / maxM)
        const v = Math.round(Math.pow(norm, 0.7) * 255)
        const m = msk[sy * N + sx]
        const o = (y * N + x) * 4
        // Tint blocked areas red
        if (m < 0.5) { d[o] = 200; d[o+1] = 50; d[o+2] = 50 }
        else { d[o] = v; d[o+1] = v; d[o+2] = v }
        d[o+3] = 255
      }
    }
    ctx.putImageData(imgData, 0, 0)
  }, [])

  // Compute IFFT(re*mask, im*mask) and draw result canvas
  const computeResult = useCallback(() => {
    const canvas = resultCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const re = new Float64Array(fftRe.current)
    const im = new Float64Array(fftIm.current)
    const msk = mask.current

    for (let i = 0; i < N * N; i++) { re[i] *= msk[i]; im[i] *= msk[i] }
    fft2d(re, im, N, true)

    const imgData = ctx.createImageData(N, N)
    const d = imgData.data
    for (let p = 0; p < N * N; p++) {
      const v = Math.max(0, Math.min(255, Math.round(re[p])))
      const o = p * 4; d[o] = v; d[o+1] = v; d[o+2] = v; d[o+3] = 255
    }
    ctx.putImageData(imgData, 0, 0)
  }, [])

  // Load image, compute FFT, draw everything
  const loadAndProcess = useCallback(async (imgKey: string) => {
    const img = await loadImage(realImagePath(imgKey), N, N)
    const gray = imageDataToGray(img)
    const re = new Float64Array(gray)
    const im = new Float64Array(N * N)
    fft2d(re, im, N, false)
    fftRe.current = re
    fftIm.current = im
    mask.current = new Float64Array(N * N).fill(1)

    // Draw source
    const srcCanvas = sourceCanvasRef.current
    if (srcCanvas) {
      const srcCtx = srcCanvas.getContext('2d')!
      // Render grayscale
      const srcData = srcCtx.createImageData(N, N)
      for (let p = 0; p < N * N; p++) {
        const v = Math.round(gray[p]), o = p * 4
        srcData.data[o] = v; srcData.data[o+1] = v; srcData.data[o+2] = v; srcData.data[o+3] = 255
      }
      srcCtx.putImageData(srcData, 0, 0)
    }
    drawSpectrum()
    computeResult()
  }, [drawSpectrum, computeResult])

  useEffect(() => { loadAndProcess(selectedImage) }, [selectedImage, loadAndProcess])

  // Paint a brush stroke on the spectrum canvas
  const applyBrush = useCallback((cx: number, cy: number) => {
    const canvas = spectrumCanvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const px = Math.round((cx - rect.left) / rect.width * N)
    const py = Math.round((cy - rect.top) / rect.height * N)
    // Map display coords to FFT coords (fftshift reverse)
    const half = N / 2
    const R = brushSize

    const setMaskAt = (dx: number, dy: number) => {
      const fx = ((px + dx + half) % N + N) % N
      const fy = ((py + dy + half) % N + N) % N
      const idx = fy * N + fx
      const symIdx = ((N - fy) % N) * N + ((N - fx) % N)

      if (drawMode === 'filter') {
        mask.current[idx] = 0
        mask.current[symIdx] = 0
      } else {
        const val = brushValue === 'white' ? 1 : 0
        mask.current[idx] = val
        mask.current[symIdx] = val
      }
    }

    for (let dy = -R; dy <= R; dy++) {
      for (let dx = -R; dx <= R; dx++) {
        if (brushShape === 'circle' && dx*dx + dy*dy > R*R) continue
        setMaskAt(dx, dy)
      }
    }
    drawSpectrum()
    computeResult()
  }, [drawMode, brushValue, brushShape, brushSize, drawSpectrum, computeResult])

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    drawing.current = true
    e.currentTarget.setPointerCapture(e.pointerId)
    applyBrush(e.clientX, e.clientY)
  }
  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return
    applyBrush(e.clientX, e.clientY)
  }
  const onPointerUp = () => { drawing.current = false }

  const applyPreset = (idx: number) => {
    PRESETS[idx].buildMask(mask.current)
    drawSpectrum()
    computeResult()
  }

  const labelStyle: React.CSSProperties = {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '10px',
    letterSpacing: '0.1em',
    color: '#9a9aa0',
    marginBottom: '6px',
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fcfbf8', fontFamily: 'sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 20px 64px' }}>
      <div style={{ width: '780px', maxWidth: '100%', background: '#fcfbf8', border: '1px solid #1a1a1c', borderRadius: '4px', overflow: 'hidden', boxShadow: '0 22px 50px -28px rgba(0,0,0,0.4)' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderBottom: '1.5px solid #1a1a1c' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button onClick={onBack} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', border: '1.5px solid #1a1a1c', padding: '5px 11px', color: '#1a1a1c', background: '#fcfbf8', cursor: 'pointer' }}>← BACK</button>
            <h2 style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", fontSize: '20px', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>フーリエプレイグラウンド</h2>
          </div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', letterSpacing: '0.14em', color: '#e0411c' }}>SPECTRUM EDITOR</div>
        </div>

        {/* Image selector */}
        <div style={{ padding: '14px 24px', borderBottom: '1px solid #e2e0da', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10.5px', letterSpacing: '0.14em', color: '#9a9aa0' }}>IMAGE</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
            {IMAGE_OPTIONS.map(opt => (
              <span key={opt.value} onClick={() => setSelectedImage(opt.value)} style={CHIP(selectedImage === opt.value)}>{opt.label}</span>
            ))}
          </div>
        </div>

        {/* Canvases */}
        <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-end', justifyContent: 'center', padding: '22px 24px 18px', borderBottom: '1.5px solid #1a1a1c' }}>
          <div>
            <div style={labelStyle}>元画像 f(x,y)</div>
            <canvas ref={sourceCanvasRef} width={N} height={N} style={{ width: '200px', height: '200px', display: 'block', border: '1.5px solid #1a1a1c', background: '#e9e7e1', imageRendering: 'auto' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingBottom: '84px', color: '#e0411c', fontFamily: "'JetBrains Mono', monospace" }}>
            <span style={{ fontSize: '18px' }}>→</span>
            <span style={{ fontSize: '8px', letterSpacing: '0.1em' }}>FFT</span>
          </div>
          <div>
            <div style={{ ...labelStyle, color: '#e0411c' }}>振幅スペクトル（編集可）</div>
            <canvas
              ref={spectrumCanvasRef}
              width={N} height={N}
              style={{ width: '200px', height: '200px', display: 'block', border: '1.5px solid #e0411c', background: '#000', cursor: 'crosshair', touchAction: 'none', imageRendering: 'auto' }}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingBottom: '84px', color: '#e0411c', fontFamily: "'JetBrains Mono', monospace" }}>
            <span style={{ fontSize: '18px' }}>→</span>
            <span style={{ fontSize: '8px', letterSpacing: '0.1em' }}>IFFT</span>
          </div>
          <div>
            <div style={{ ...labelStyle, color: '#1f9d57' }}>出力画像 f′(x,y)</div>
            <canvas ref={resultCanvasRef} width={N} height={N} style={{ width: '200px', height: '200px', display: 'block', border: '1.5px solid #1a1a1c', background: '#e9e7e1', imageRendering: 'auto' }} />
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', gap: 0, borderBottom: '1.5px solid #1a1a1c' }}>
          <div style={{ flex: 1, padding: '18px 24px', borderRight: '1.5px solid #1a1a1c' }}>
            <div style={{ display: 'flex', gap: '22px', flexWrap: 'wrap', marginBottom: '16px' }}>
              {/* Draw mode */}
              <div>
                <div style={{ ...labelStyle, marginBottom: '7px' }}>① スペクトル描画</div>
                <div style={{ display: 'flex', gap: 0, border: '1.5px solid #1a1a1c', width: 'max-content' }}>
                  {(['white', 'black'] as BrushValue[]).map(v => (
                    <div key={v} onClick={() => { setDrawMode('draw'); setBrushValue(v) }}
                      style={{ ...CHIP(drawMode === 'draw' && brushValue === v), padding: '6px 12px' }}>
                      {v === 'white' ? '白（追加）' : '黒（除去）'}
                    </div>
                  ))}
                </div>
              </div>
              {/* Filter mode */}
              <div>
                <div style={{ ...labelStyle, color: '#e0411c', marginBottom: '7px' }}>② フィルタ（マスク）</div>
                <div style={{ display: 'flex', gap: 0, border: '1.5px solid #e0411c', width: 'max-content' }}>
                  <div onClick={() => setDrawMode('filter')}
                    style={{ ...CHIP(drawMode === 'filter'), padding: '6px 12px', borderColor: '#e0411c', color: drawMode === 'filter' ? '#fcfbf8' : '#e0411c', background: drawMode === 'filter' ? '#e0411c' : '#fcfbf8' }}>
                    遮断（赤）
                  </div>
                </div>
              </div>
              <button onClick={() => { mask.current.fill(1); drawSpectrum(); computeResult() }}
                style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', padding: '8px 14px', border: '1.5px solid #1a1a1c', background: '#fcfbf8', color: '#1a1a1c', cursor: 'pointer', alignSelf: 'flex-end', height: '35px' }}>
                ⟳ 初期化
              </button>
            </div>
            {/* Brush size + shape */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                <span style={{ fontFamily: 'sans-serif', fontSize: '12px', color: '#56565c', whiteSpace: 'nowrap' }}>筆サイズ</span>
                <input type="range" min={1} max={20} step={1} value={brushSize} onChange={e => setBrushSize(Number(e.target.value))}
                  style={{ flex: 1, accentColor: '#e0411c' }} />
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', color: '#141416', fontWeight: 700, textAlign: 'right', width: '24px' }}>{brushSize}</span>
              </div>
              <div style={{ display: 'flex', gap: 0, border: '1.5px solid #1a1a1c' }}>
                {(['circle', 'square'] as BrushShape[]).map(s => (
                  <div key={s} onClick={() => setBrushShape(s)}
                    style={{ ...CHIP(brushShape === s), padding: '6px 10px' }}>
                    {s === 'circle' ? '円' : '四角'}
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Legend */}
          <div style={{ flex: '0 0 auto', padding: '18px 24px', maxWidth: '200px' }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: '#9a9aa0', lineHeight: '1.7' }}>
              中央＝低周波／外側＝高周波。<br />
              <span style={{ color: '#1a1a1c' }}>①描画</span>でスペクトルを白/黒に編集。<span style={{ color: '#e0411c' }}>②フィルタ</span>で周波数を遮断（赤い領域＝遮断中）。対称点も自動編集。
            </div>
          </div>
        </div>

        {/* Presets */}
        <div style={{ padding: '16px 24px 22px' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10.5px', letterSpacing: '0.14em', color: '#9a9aa0', marginBottom: '12px' }}>PRESETS</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', border: '1.5px solid #1a1a1c' }}>
            {PRESETS.map((p, i) => (
              <div key={i} onClick={() => applyPreset(i)}
                style={{ padding: '10px 12px', borderRight: i < 3 ? '1px solid #e2e0da' : 'none', fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#141416', cursor: 'pointer', lineHeight: 1.4 }}>
                <span style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", fontWeight: 800, fontSize: '13px', color: '#e0411c', marginRight: '4px' }}>{i + 1}</span>
                {p.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
