import { create } from 'zustand'

const useCombatStore = create((set, get) => ({
  active: false,
  enemy: null,          // current enemy object
  enemyHp: 0,
  enemyMaxHp: 0,
  phase: 'idle',        // 'idle' | 'combat' | 'victory' | 'defeat'
  loot: [],             // items dropped this combat
  punkEarned: 0,
  damageNumbers: [],    // floating damage display
  killCount: 0,

  startCombat: (enemy) => set({
    active: true,
    enemy,
    enemyHp: enemy.hp,
    enemyMaxHp: enemy.hp,
    phase: 'combat',
    loot: [],
    punkEarned: 0,
    damageNumbers: [],
  }),

  damageEnemy: (amount) => {
    const s = get()
    const newHp = Math.max(0, s.enemyHp - amount)
    const id = Date.now() + Math.random()
    set({
      enemyHp: newHp,
      damageNumbers: [...s.damageNumbers, { id, amount, x: 50, y: 40, color: '#ff2d55' }],
    })
    if (newHp === 0) get().enemyDied()
  },

  enemyDied: () => set((s) => ({
    phase: 'victory',
    killCount: s.killCount + 1,
  })),

  setLoot: (loot, punkEarned) => set({ loot, punkEarned }),

  endCombat: () => set({
    active: false,
    enemy: null,
    phase: 'idle',
    loot: [],
    punkEarned: 0,
    damageNumbers: [],
  }),

  removeDamageNumber: (id) => set((s) => ({
    damageNumbers: s.damageNumbers.filter((d) => d.id !== id),
  })),
}))

export default useCombatStore
