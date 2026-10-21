import { useEffect, useState } from 'react'

type Props = {
  blob: Blob
  alt: string
  className?: string
}

/** Shows an image stored as a Blob, and frees the temporary address when it goes away. */
export function BlobImage({ blob, alt, className }: Props) {
  const [url, setUrl] = useState<string | null>(null)

  useEffect(() => {
    const objectUrl = URL.createObjectURL(blob)
    const frame = requestAnimationFrame(() => setUrl(objectUrl))
    return () => {
      cancelAnimationFrame(frame)
      URL.revokeObjectURL(objectUrl)
    }
  }, [blob])

  if (!url) return <div className={`${className ?? ''} blob-loading`} aria-hidden="true" />
  return <img className={className} src={url} alt={alt} />
}
