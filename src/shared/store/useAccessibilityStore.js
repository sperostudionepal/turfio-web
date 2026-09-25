import { create } from 'zustand';

export const FONT_OPTIONS = [
  {
    id: 'manrope',
    name: 'Manrope',
    category: 'Modern & Balanced',
    description: 'Clean geometry with open letterforms, ideal for clarity and interfaces.',
    fontFamily: "'Manrope', system-ui, -apple-system, sans-serif",
  },
  {
    id: 'inter',
    name: 'Inter',
    category: 'High Legibility',
    description: 'Designed specifically for computer screens to maximize character distinction.',
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
  },
  {
    id: 'lexend',
    name: 'Lexend',
    category: 'Dyslexia Friendly',
    description: 'Scientifically scaled to reduce visual crowding and increase reading velocity.',
    fontFamily: "'Lexend', system-ui, -apple-system, sans-serif",
  },
  {
    id: 'jakarta',
    name: 'Plus Jakarta Sans',
    category: 'Warm & Dynamic',
    description: 'Distinctive curved apertures providing a friendly, energetic sports aesthetic.',
    fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
  },
];

export const FONT_SIZES = [
  { id: 'small', label: 'Small', scale: '90%', fontSize: '14.4px', description: 'Compact display' },
  { id: 'default', label: 'Default', scale: '100%', fontSize: '16px', description: 'Standard size' },
  { id: 'medium', label: 'Medium', scale: '112%', fontSize: '18px', description: '+12% larger' },
  { id: 'large', label: 'Large', scale: '125%', fontSize: '20px', description: '+25% larger' },
  { id: 'xl', label: 'Extra Large', scale: '138%', fontSize: '22px', description: '+38% larger' },
];

const STORAGE_KEY = 'turfio_font_settings_v1';

const defaultState = {
  fontTheme: 'manrope',
  fontSize: 'default',
  isOpen: false,
};

function loadStoredSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;
    return { ...defaultState, ...JSON.parse(raw), isOpen: false };
  } catch {
    return defaultState;
  }
}

export function applySettingsToDOM(settings) {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;

  // 1. Data attributes
  root.setAttribute('data-font-theme', settings.fontTheme || 'manrope');
  root.setAttribute('data-font-size', settings.fontSize || 'default');

  // Clean up any old attributes
  root.removeAttribute('data-theme-color');
  root.removeAttribute('data-high-contrast');
  root.removeAttribute('data-reduced-motion');

  // 2. Font family
  const fontObj = FONT_OPTIONS.find((f) => f.id === settings.fontTheme) || FONT_OPTIONS[0];
  root.style.setProperty('--font-app-family', fontObj.fontFamily);
  document.body.style.fontFamily = fontObj.fontFamily;

  // 3. Font size scaling
  const sizeObj = FONT_SIZES.find((s) => s.id === settings.fontSize) || FONT_SIZES[1];
  root.style.setProperty('--app-font-size', sizeObj.fontSize);
  root.style.fontSize = sizeObj.fontSize;
}

export const useAccessibilityStore = create((set, get) => ({
  ...loadStoredSettings(),

  setFontTheme: (fontTheme) => {
    set({ fontTheme });
    get().saveAndApply();
  },

  setFontSize: (fontSize) => {
    set({ fontSize });
    get().saveAndApply();
  },

  setIsOpen: (isOpen) => {
    set({ isOpen });
  },

  toggleOpen: () => {
    set((state) => ({ isOpen: !state.isOpen }));
  },

  applySettings: (fontTheme, fontSize) => {
    const toSave = {
      fontTheme: fontTheme ?? get().fontTheme,
      fontSize: fontSize ?? get().fontSize,
    };
    set(toSave);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch (e) {
      console.warn('Failed to save font settings:', e);
    }
    applySettingsToDOM(toSave);
  },

  resetDefaults: () => {
    const toSave = {
      fontTheme: 'manrope',
      fontSize: 'default',
    };
    set(toSave);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch (e) {
      console.warn('Failed to save font settings:', e);
    }
    applySettingsToDOM(toSave);
  },

  saveAndApply: () => {
    const state = get();
    const toSave = {
      fontTheme: state.fontTheme,
      fontSize: state.fontSize,
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch (e) {
      console.warn('Failed to save font settings:', e);
    }
    applySettingsToDOM(toSave);
  },

  initialize: () => {
    const state = get();
    applySettingsToDOM(state);
  },
}));

export default useAccessibilityStore;
