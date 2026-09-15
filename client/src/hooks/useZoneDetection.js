import { useEffect } from 'react'
import { detectZone } from '@shared/zones.js'
import usePlayerStore from '../store/playerStore.js'
import useWorldStore from '../store/worldStore.js'

/**
 * useZoneDetection — detects which Portland zone the player is in
 * and triggers enemy spawning when zone changes.
 */
export function useZoneDetection(lat, lng) {
  const setCurrentZone = usePlayerStore((s) => s.setCurrentZone)
  const setActiveZone  = useWorldStore((s) => s.setActiveZone)
  const spawnEnemies   = useWorldStore((s) => s.spawnEnemies)
  const currentZone    = usePlayerStore((s) => s.currentZone)

  useEffect(() => {
    const zone = detectZone(lat, lng)
    const newZoneId = zone?.id ?? null
    const oldZoneId = currentZone?.id ?? null

    if (newZoneId !== oldZoneId) {
      setCurrentZone(zone)
      setActiveZone(zone)
      if (zone) {
        spawnEnemies(lat, lng, zone.tier)
      }
    }
  }, [lat, lng, currentZone, setCurrentZone, setActiveZone, spawnEnemies])
}
