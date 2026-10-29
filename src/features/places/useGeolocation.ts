import { useEffect, useState } from 'react'

export type GeoState = {
  status: 'waiting' | 'ready' | 'denied' | 'unavailable' | 'error'
  lat?: number
  lng?: number
  /** Accuracy in metres, as reported by the phone. Smaller is better. */
  accuracy?: number
}

const supported = typeof navigator !== 'undefined' && 'geolocation' in navigator

/** Follows the phone's position while the page is open, and stops when it closes. */
export function useGeolocation(): GeoState {
  const [state, setState] = useState<GeoState>({ status: supported ? 'waiting' : 'unavailable' })

  useEffect(() => {
    if (!supported) return
    const watchId = navigator.geolocation.watchPosition(
      (position) =>
        setState({
          status: 'ready',
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
        }),
      (error) => setState({ status: error.code === error.PERMISSION_DENIED ? 'denied' : 'error' }),
      { enableHighAccuracy: true, maximumAge: 2000, timeout: 20000 },
    )
    return () => navigator.geolocation.clearWatch(watchId)
  }, [])

  return state
}
