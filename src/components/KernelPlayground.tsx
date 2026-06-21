import { useState, useEffect, useRef } from 'react'
import { loadImage, isRealImage, realImagePath } from '../processors/imageLoader'
import { generateSourceImage } from '../processors/testImages'

// Apply kernel with explicit scale divisor (bypasses applyKernel's auto-normalization)
function applyKernelWithScale(imageData: ImageData, kernel: number[][], scale: number): ImageData {
  const { width, height, data: src } = imageData
  const out = new Uint8ClampedArray(src.length)
  const kH = kernel.length
  const kW = kernel[0].length
  const halfH = Math.floor(kH / 2)
  const halfW = Math.floor(kW / 2)
  const kSum = kernel.flat().reduce((a, b) => a + b, 0)
  // When scale=1: auto-normalize by kSum (same as applyKernel).
  // When scale≠1: user explicitly overrides — multiply accumulated sum by scale.
  const effectiveScale = scale !== 1 ? scale : (kSum !== 0 ? 1 / kSum : null)

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let r = 0, g = 0, b = 0
      for (let ky = 0; ky < kH; ky++) {
        for (let kx = 0; kx < kW; kx++) {
          const sy = Math.min(height - 1, Math.max(0, y + ky - halfH))
          const sx = Math.min(width - 1, Math.max(0, x + kx - halfW))
          const idx = (sy * width + sx) * 4
          const w = kernel[ky][kx]
          r += src[idx]     * w
          g += src[idx + 1] * w
          b += src[idx + 2] * w
        }
      }
      const di = (y * width + x) * 4
      if (effectiveScale !== null) {
        out[di]     = Math.max(0, Math.min(255, Math.round(r * effectiveScale)))
        out[di + 1] = Math.max(0, Math.min(255, Math.round(g * effectiveScale)))
        out[di + 2] = Math.max(0, Math.min(255, Math.round(b * effectiveScale)))
      } else {
        out[di]     = Math.max(0, Math.min(255, Math.abs(Math.round(r)) + 128))
        out[di + 1] = Math.max(0, Math.min(255, Math.abs(Math.round(g)) + 128))
        out[di + 2] = Math.max(0, Math.min(255, Math.abs(Math.round(b)) + 128))
      }
      out[di + 3] = src[(y * width + x) * 4 + 3]
    }
  }
  return new ImageData(out, width, height)
}

// Source image options
const IMAGE_OPTIONS = [
  { value: 'momiji',        label: '紅葉（momiji）' },
  { value: 'bud',           label: '芽（bud）' },
  { value: 'summer',        label: 'サマービーチ（summer）' },
  { value: 'shapes',        label: '図形（shapes）' },
  { value: 'blue_kikagaku', label: '幾何学模様（blue_kikagaku）' },
  { value: 'fence',         label: '金網（fence）' },
  { value: 'metal',         label: '金属（metal）' },
  { value: 'pebbles',       label: '小石（pebbles）' },
  { value: 'checker',       label: 'チェッカー（生成）' },
  { value: 'gradient',      label: 'グラデーション（生成）' },
]

// Preset kernels
const PRESETS: { label: string; kernel: number[][]; scale: number }[] = [
  { label: '移動平均',     kernel: [[1,1,1],[1,1,1],[1,1,1]], scale: 1/9 },
  { label: 'ガウシアン',   kernel: [[1,2,1],[2,4,2],[1,2,1]], scale: 1/16 },
  { label: '鮮鋭化',       kernel: [[0,-1,0],[-1,5,-1],[0,-1,0]], scale: 1 },
  { label: '全方向鮮鋭化', kernel: [[-1,-1,-1],[-1,9,-1],[-1,-1,-1]], scale: 1 },
  { label: 'ラプラシアン', kernel: [[0,1,0],[1,-4,1],[0,1,0]], scale: 1 },
  { label: 'Sobel X',      kernel: [[-1,0,1],[-2,0,2],[-1,0,1]], scale: 1 },
  { label: 'Sobel Y',      kernel: [[-1,-2,-1],[0,0,0],[1,2,1]], scale: 1 },
  { label: '恒等変換',     kernel: [[0,0,0],[0,1,0],[0,0,0]], scale: 1 },
]

type Props = { onBack: () => void }

export default function KernelPlayground({ onBack }: Props) {
  const [selectedImage, setSelectedImage] = useState('momiji')
  const [kernel, setKernel] = useState<number[][]>([[0,0,0],[0,1,0],[0,0,0]])
  const [scale, setScale] = useState(1)
  const [scaleInput, setScaleInput] = useState('1')
  const [sourceData, setSourceData] = useState<ImageData | null>(null)
  const sourceCanvasRef = useRef<HTMLCanvasElement>(null)
  const resultCanvasRef = useRef<HTMLCanvasElement>(null)
  const SIZE = 240

  // Load source image when selectedImage changes
  useEffect(() => {
    let cancelled = false
    async function load() {
      let img: ImageData
      if (isRealImage(selectedImage)) {
        img = await loadImage(realImagePath(selectedImage), SIZE, SIZE)
      } else {
        img = generateSourceImage(selectedImage)
      }
      if (cancelled) return
      setSourceData(img)
    }
    load()
    return () => { cancelled = true }
  }, [selectedImage])

  // Draw source canvas
  useEffect(() => {
    if (!sourceData || !sourceCanvasRef.current) return
    const ctx = sourceCanvasRef.current.getContext('2d')!
    const off = document.createElement('canvas')
    off.width = sourceData.width
    off.height = sourceData.height
    off.getContext('2d')!.putImageData(sourceData, 0, 0)
    ctx.clearRect(0, 0, SIZE, SIZE)
    ctx.drawImage(off, 0, 0, SIZE, SIZE)
  }, [sourceData])

  // Apply kernel and draw result
  useEffect(() => {
    if (!sourceData || !resultCanvasRef.current) return
    const ctx = resultCanvasRef.current.getContext('2d')!
    // Apply scale multiplier to each kernel element
    const result = applyKernelWithScale(sourceData, kernel, scale)
    const off = document.createElement('canvas')
    off.width = result.width
    off.height = result.height
    off.getContext('2d')!.putImageData(result, 0, 0)
    ctx.clearRect(0, 0, SIZE, SIZE)
    ctx.drawImage(off, 0, 0, SIZE, SIZE)
  }, [sourceData, kernel, scale])

  function updateCell(row: number, col: number, value: string) {
    const num = parseFloat(value)
    if (isNaN(num)) return
    const next = kernel.map(r => [...r])
    next[row][col] = num
    setKernel(next)
  }

  function applyPreset(preset: typeof PRESETS[0]) {
    setKernel(preset.kernel.map(r => [...r]))
    setScale(preset.scale)
    setScaleInput(
      preset.scale === 1/9  ? '1/9'  :
      preset.scale === 1/16 ? '1/16' :
      String(preset.scale)
    )
  }

  function handleScaleInput(value: string) {
    setScaleInput(value)
    // Support fractions like "1/9", "1/16"
    const num = value.includes('/')
      ? parseFloat(value.split('/')[0]) / parseFloat(value.split('/')[1])
      : parseFloat(value)
    if (!isNaN(num) && num !== 0) setScale(num)
  }

  // Compute kernel sum for display
  const kernelSum = kernel.flat().reduce((a, b) => a + b, 0)

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '1.5rem', fontFamily: 'sans-serif' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <button onClick={onBack} style={{ background: 'none', border: '1px solid #d1d5db', borderRadius: '6px', padding: '0.4rem 0.8rem', cursor: 'pointer', fontSize: '0.9rem' }}>
          ← 戻る
        </button>
        <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 'bold' }}>カーネルプレイグラウンド</h2>
      </div>

      {/* Image selector */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#374151', display: 'block', marginBottom: '0.5rem' }}>
          画像を選択
        </label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {IMAGE_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => setSelectedImage(opt.value)}
              style={{
                padding: '0.4rem 0.8rem',
                border: `2px solid ${selectedImage === opt.value ? '#2563eb' : '#d1d5db'}`,
                borderRadius: '6px',
                background: selectedImage === opt.value ? '#eff6ff' : '#fff',
                color: selectedImage === opt.value ? '#1d4ed8' : '#374151',
                fontWeight: selectedImage === opt.value ? 'bold' : 'normal',
                cursor: 'pointer',
                fontSize: '0.85rem',
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main content: images + kernel editor side by side */}
      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
        {/* Images */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <figure style={{ margin: 0, textAlign: 'center' }}>
            <figcaption style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '4px' }}>元画像</figcaption>
            <canvas ref={sourceCanvasRef} width={SIZE} height={SIZE} style={{ border: '1px solid #e5e7eb', borderRadius: '4px', display: 'block' }} />
          </figure>
          <figure style={{ margin: 0, textAlign: 'center' }}>
            <figcaption style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '4px' }}>フィルタ適用後</figcaption>
            <canvas ref={resultCanvasRef} width={SIZE} height={SIZE} style={{ border: '1px solid #e5e7eb', borderRadius: '4px', display: 'block' }} />
          </figure>
        </div>

        {/* Kernel editor */}
        <div style={{ flex: '0 0 auto' }}>
          <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#374151', marginBottom: '0.75rem' }}>
            カーネル編集
          </div>
          <table style={{ borderCollapse: 'collapse', marginBottom: '0.5rem' }}>
            <tbody>
              {kernel.map((row, ri) => (
                <tr key={ri}>
                  {row.map((val, ci) => (
                    <td key={ci} style={{ padding: '2px' }}>
                      <input
                        type="number"
                        value={val}
                        onChange={e => updateCell(ri, ci, e.target.value)}
                        style={{
                          width: '56px',
                          height: '44px',
                          textAlign: 'center',
                          border: '1px solid #9ca3af',
                          borderRadius: '4px',
                          fontSize: '1rem',
                          fontFamily: 'monospace',
                          padding: 0,
                        }}
                        step="any"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.75rem' }}>
            合計: {kernelSum.toFixed(3)}
            {Math.abs(kernelSum) < 0.001 && (
              <span style={{ marginLeft: '0.5rem', color: '#d97706' }}>（合計0 → 平坦部がグレーに）</span>
            )}
          </div>

          {/* Scale input */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#374151' }}>倍率</span>
            <span style={{ fontSize: '1rem', color: '#6b7280' }}>×</span>
            <input
              type="text"
              value={scaleInput}
              onChange={e => handleScaleInput(e.target.value)}
              style={{
                width: '64px',
                height: '36px',
                textAlign: 'center',
                border: '1px solid #9ca3af',
                borderRadius: '4px',
                fontSize: '0.95rem',
                fontFamily: 'monospace',
                padding: '0 4px',
              }}
              placeholder="1/9"
            />
            <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>（分数可: 1/9）</span>
          </div>

          {/* Presets */}
          <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#374151', marginBottom: '0.5rem' }}>
            プリセット
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            {PRESETS.map(p => (
              <button
                key={p.label}
                onClick={() => applyPreset(p)}
                style={{
                  padding: '0.4rem 0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  background: '#f9fafb',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  textAlign: 'left',
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
