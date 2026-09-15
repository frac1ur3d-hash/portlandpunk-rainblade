import { create } from 'zustand'
import { PORTLAND_ZONES } from '@shared/zones.js'

const useWorldStore = create((set) => ({
  zones: PORTLAND_ZONES,
  activeZone: null,
  enemies: [],        // { id, lat, lng, type, enemyData }
  spawnTick: 0,

  setActiveZone: (zone) => set({ activeZone: zone }),

  spawnEnemies: (playerLat, playerLng, zoneTier) => {
    const count = 4 + Math.floor(Math.random() * 4)
    const enemies = Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2
      const radiusDeg = (80 + Math.random() * 200) / 111320 // meters → degrees
      return {
        id: `enemy-${Date.now()}-${i}`,
        lat: playerLat + Math.sin(angle) * radiusDeg,
        lng: playerLng + Math.cos(angle) * radiusDeg / Math.cos(playerLat * Math.PI / 180),
        tier: Math.random() < 0.1 ? 'boss' : Math.random() < 0.3 ? 'elite' : 'trash',
        zoneId: 0, // will be set dynamically
        hp: 100,
        alive: true,
      }
    })
    set((s) => ({ enemies, spawnTick: s.spawnTick + 1 }))
  },

  killEnemy: (id) => set((s) => ({
    enemies: s.enemies.filter((e) => e.id !== id),
  })),

  clearEnemies: () => set({ enemies: [] }),
}))

export default useWorldStore
