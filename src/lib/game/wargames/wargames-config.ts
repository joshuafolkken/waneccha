// IBM-PC / DOS-style terminal font (VT323, SIL OFL 1.1) used across the WarGames UI,
// both as a CSS @font-face (see layout.css) and as a Troika/canvas font URL.
export const TERMINAL_FONT_URL = '/fonts/VT323.ttf'
export const TERMINAL_FONT_FAMILY = 'VT323'

// Phosphor-green WOPR palette.
export const SCREEN_GLOW_COLOR = '#33ff66'
export const SCREEN_DIM_COLOR = '#0a3318'
// Dim-but-visible blue-gray surfaces: the room should read as a faintly-lit interior,
// not a pitch-black void (see issue #27). Kept low enough to preserve the WOPR night mood.
export const ROOM_FLOOR_COLOR = '#2e3744'
export const ROOM_WALL_COLOR = '#404b5c'
export const ROOM_CEILING_COLOR = '#2e3744'
export const SCENE_BG_COLOR = '#01030a'

// Translucent screen face opacity (half-transparent, per the spec).
export const SCREEN_OPACITY = 0.5

// Side displays auto-switch on a fixed cadence within the requested 5–10s window.
export const SIDE_CYCLE_INTERVAL_MS = 7000
