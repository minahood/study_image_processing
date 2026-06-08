/**
 * Node/jsdom 環境で ImageData が未定義の場合のポリフィル。
 * ブラウザの ImageData と同等の最小実装。
 */
if (typeof globalThis.ImageData === 'undefined') {
  class ImageDataPolyfill {
    data: Uint8ClampedArray
    width: number
    height: number
    colorSpace: PredefinedColorSpace = 'srgb'

    constructor(data: Uint8ClampedArray | number, widthOrSw: number, heightOrSh?: number) {
      if (typeof data === 'number') {
        // new ImageData(width, height)
        this.width = data
        this.height = widthOrSw
        this.data = new Uint8ClampedArray(data * widthOrSw * 4)
      } else {
        this.data = data
        this.width = widthOrSw
        this.height = heightOrSh ?? data.length / (widthOrSw * 4)
      }
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(globalThis as any).ImageData = ImageDataPolyfill
}
