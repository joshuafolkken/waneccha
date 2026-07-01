// IBM-PC / DOS-style terminal font (VT323, SIL OFL 1.1) used across the WarGames UI,
// both as a CSS @font-face (see layout.css) and as a Troika/canvas font URL.
export const TERMINAL_FONT_URL = '/fonts/VT323.ttf'
export const TERMINAL_FONT_FAMILY = 'VT323'

// Shared WOPR glow/accent color for the screen borders, side-display text/graphics, and tic-tac-toe
// marks. White (not the earlier cyan) to match the WarGames (1983) console's white screen borders and
// bright readouts. The NORAD banner text uses its own blue (TERMINAL_TEXT_COLOR) instead.
export const SCREEN_GLOW_COLOR = '#ffffff'
export const SCREEN_DIM_COLOR = '#0a2933'
// NORAD banner text (the center TerminalScreen). A saturated blue matching the movie's blue console
// message — deliberately NOT the shared white glow and NOT a pale near-white blue.
export const TERMINAL_TEXT_COLOR = '#74a0ff'
// Neutral white room lighting — the cyan mood comes from the surface colors and glowing screens,
// not a tinted light, so lit surfaces read with true color.
export const LIGHT_COLOR = '#ffffff'
// Canvas background behind the WOPR operation-screen text/graphics (side & center displays),
// kept in the same dark-cyan family as the rest of the palette.
export const SCREEN_CANVAS_BG_COLOR = '#02141a'
// Dim-but-visible cyan-tinted surfaces: the room should read as a faintly-lit interior,
// not a pitch-black void (see issue #27). Kept low enough to preserve the WOPR night mood.
export const ROOM_FLOOR_COLOR = '#1e3a44'
export const ROOM_WALL_COLOR = '#2a505c'
export const ROOM_CEILING_COLOR = '#1e3a44'
export const SCENE_BG_COLOR = '#01060a'

// Translucent screen face opacity (half-transparent, per the spec).
export const SCREEN_OPACITY = 0.5

// Side displays auto-switch on a fixed cadence within the requested 5–10s window.
export const SIDE_CYCLE_INTERVAL_MS = 7000
