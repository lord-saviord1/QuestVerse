export type CompressedImage = {
  blob: Blob
  width: number
  height: number
}

const FAIL = 'Could not process the photo on this device.'

async function decode(
  file: File,
): Promise<{ source: CanvasImageSource; width: number; height: number; release: () => void }> {
  try {
    // Applies the phone's rotation info so portrait photos are not sideways.
    const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' })
    return {
      source: bitmap,
      width: bitmap.width,
      height: bitmap.height,
      release: () => bitmap.close(),
    }
  } catch {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.src = url
    await img.decode()
    return {
      source: img,
      width: img.naturalWidth,
      height: img.naturalHeight,
      release: () => URL.revokeObjectURL(url),
    }
  }
}

/**
 * Shrinks a photo so the longest side is at most `maxSide` pixels and re-encodes it as JPEG.
 * This keeps uploads small for students on limited data.
 */
export async function compressImage(
  file: File,
  maxSide = 1280,
  quality = 0.8,
): Promise<CompressedImage> {
  const decoded = await decode(file)
  try {
    const scale = Math.min(1, maxSide / Math.max(decoded.width, decoded.height))
    const width = Math.max(1, Math.round(decoded.width * scale))
    const height = Math.max(1, Math.round(decoded.height * scale))

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error(FAIL)
    ctx.drawImage(decoded.source, 0, 0, width, height)

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/jpeg', quality),
    )
    if (!blob) throw new Error(FAIL)
    return { blob, width, height }
  } finally {
    decoded.release()
  }
}
