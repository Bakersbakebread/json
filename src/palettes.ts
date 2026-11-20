// The seanthorne.co.uk palettes in data-palette order; their colours live in style.css.
// `bg` feeds theme-color. index.html keeps its own copy of the bgs because its script
// runs before this module loads.
export const palettes = [
  { id: 0, name: 'Peach', bg: '#fff1e0', dark: false },
  { id: 1, name: 'Mint', bg: '#d6f5e3', dark: false },
  { id: 2, name: 'Night', bg: '#14122b', dark: true },
  { id: 3, name: 'Bubblegum', bg: '#ffd6e8', dark: false },
  { id: 4, name: 'Cobalt', bg: '#1a2fd0', dark: true },
  { id: 5, name: 'Lilac', bg: '#e4dbff', dark: false },
  { id: 6, name: 'Forest', bg: '#0f2a20', dark: true },
] as const

/** Auto follows the OS: Peach when light, Night when dark. */
export const AUTO_LIGHT = 0
export const AUTO_DARK = 2
