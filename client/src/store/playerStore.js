import { create } from 'zustand'

const STORAGE_KEY = 'portlandpunk_save_v1';

const generateTemporaryWallet = () => {
  try {
    const bytes = new Uint8Array(20);
    window.crypto.getRandomValues(bytes);
    return '0x' + Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('');
  } catch {
    return '0x' + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
  }
};

const loadSavedState = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.warn('Could not load save:', e);
  }
  return null;
};

const saved = loadSavedState();

const usePlayerStore = create((set, get) => ({
  // Character
  character: saved?.character || null,
  temporaryWallet: saved?.temporaryWallet || null,
  hp: saved?.hp || 100,
  maxHp: saved?.maxHp || 100,
  mp: saved?.mp || 50,
  maxMp: saved?.maxMp || 50,
  xp: saved?.xp || 0,
  level: saved?.level || 1,

  // Inventory & Gear
  inventory: saved?.inventory || [],
  equippedItems: saved?.equippedItems || {},

  // Portland Location (defaults to Downtown Portland / Pioneer Square)
  lat: saved?.lat || 45.5231,
  lng: saved?.lng || -122.6765,
  currentZone: null,

  // Stats
  stats: { attack: 12, defense: 6, speed: 6, intel: 6, luck: 6 },

  // $PUNK Currency (in-game pure number, no blockchain overhead)
  punkBalance: saved?.punkBalance || 50,

  // Actions
  setCharacter: (character) => {
    const maxHp = 100 + character.level * 15;
    const maxMp = 50 + character.level * 8;
    const tempWallet = get().temporaryWallet || generateTemporaryWallet();

    set({
      character,
      temporaryWallet: tempWallet,
      maxHp,
      hp: maxHp,
      maxMp,
      mp: maxMp,
      level: character.level,
      xp: character.xp,
    });
    get().saveToStorage();
  },

  setPosition: (lat, lng) => {
    set({ lat, lng });
  },

  setCurrentZone: (zone) => set({ currentZone: zone }),

  takeDamage: (amount) => set((s) => ({ hp: Math.max(0, s.hp - amount) })),
  healHp: (amount) => set((s) => ({ hp: Math.min(s.maxHp, s.hp + amount) })),
  spendMp: (amount) => set((s) => ({ mp: Math.max(0, s.mp - amount) })),

  gainXp: (amount) => {
    const s = get();
    const newXp = s.xp + amount;
    const nextLevelThreshold = s.level * 100;
    if (newXp >= nextLevelThreshold) {
      const newLvl = s.level + 1;
      const newMaxHp = 100 + newLvl * 15;
      const newMaxMp = 50 + newLvl * 8;
      set({
        level: newLvl,
        xp: newXp - nextLevelThreshold,
        maxHp: newMaxHp,
        hp: newMaxHp,
        maxMp: newMaxMp,
        mp: newMaxMp
      });
    } else {
      set({ xp: newXp });
    }
    get().saveToStorage();
  },

  addPunk: (amount) => {
    set((s) => ({ punkBalance: s.punkBalance + amount }));
    get().saveToStorage();
  },

  addToInventory: (item) => {
    set((s) => ({ inventory: [...s.inventory, item] }));
    get().saveToStorage();
  },

  equipItem: (slot, item) => {
    set((s) => ({
      equippedItems: { ...s.equippedItems, [slot]: item },
    }));
    get().saveToStorage();
  },

  saveToStorage: () => {
    try {
      const s = get();
      const stateToSave = {
        character: s.character,
        temporaryWallet: s.temporaryWallet,
        hp: s.hp,
        maxHp: s.maxHp,
        mp: s.mp,
        maxMp: s.maxMp,
        xp: s.xp,
        level: s.level,
        inventory: s.inventory,
        equippedItems: s.equippedItems,
        lat: s.lat,
        lng: s.lng,
        punkBalance: s.punkBalance
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (e) {
      console.warn('Save failed:', e);
    }
  },

  resetSave: () => {
    localStorage.removeItem(STORAGE_KEY);
    set({
      character: null,
      temporaryWallet: null,
      hp: 100,
      maxHp: 100,
      mp: 50,
      maxMp: 50,
      xp: 0,
      level: 1,
      inventory: [],
      equippedItems: {},
      punkBalance: 50
    });
  }
}));

export default usePlayerStore;
