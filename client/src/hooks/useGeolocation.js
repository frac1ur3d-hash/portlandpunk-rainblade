import { useState, useEffect, useRef, useCallback } from 'react'
import usePlayerStore from '../store/playerStore.js'

const PORTLAND_CENTER = { lat: 45.5231, lng: -122.6765 }

/**
 * useGeolocation — tracks player GPS position.
 * In simulator mode (desktop), clicking the map moves the player.
 */
export function useGeolocation(simulatorMode = false) {
  const setPosition = usePlayerStore((s) => s.setPosition)
  const [position, setLocalPos] = useState(PORTLAND_CENTER)
  const [error, setError] = useState(null)
  const watchRef = useRef(null)

  const moveTo = useCallback((lat, lng) => {
    setLocalPos({ lat, lng })
    setPosition(lat, lng)
  }, [setPosition])

  useEffect(() => {
    if (simulatorMode) return // skip GPS watch in simulator mode

    if (!navigator.geolocation) {
      setError('Geolocation not supported')
      return
    }

    watchRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords
        setLocalPos({ lat, lng })
        setPosition(lat, lng)
      },
      (err) => {
        setError(err.message)
        console.warn('GPS error:', err)
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 5000 }
    )

    return () => {
      if (watchRef.current != null) {
        navigator.geolocation.clearWatch(watchRef.current)
      }
    }
  }, [simulatorMode, setPosition])

  return { position, error, moveTo }
}
