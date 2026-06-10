// World-space layout for the WarGames control room. The first-person Player camera spawns
// behind the "click to start" backdrop and looks down -Z at the three screens.

const SCREEN_Y = 1.6

// Center screen — reserved as the tic-tac-toe board frame (filled by a later issue).
export const CENTER_Z = -1.6
export const CENTER_W = 2.4
export const CENTER_H = 1.8
export const CENTER_POS: [number, number, number] = [0, SCREEN_Y, CENTER_Z]

// Side screens — angled inward like a cockpit, cycling the movie displays.
const SIDE_X = 2
const SIDE_Z = -0.9
export const SIDE_W = 1.8
export const SIDE_H = 1.4
export const SIDE_ROT = 0.5
export const LEFT_POS: [number, number, number] = [-SIDE_X, SCREEN_Y, SIDE_Z]
export const RIGHT_POS: [number, number, number] = [SIDE_X, SCREEN_Y, SIDE_Z]

// Lighting.
export const AMBIENT_INTENSITY = 0.35
export const POINT_INTENSITY = 1.2
export const POINT_Y = 2.6
export const POINT_POS: [number, number, number] = [0, POINT_Y, 0]

// Content sits a hair in front of the translucent glass plane to avoid z-fighting.
export const CONTENT_Z_OFFSET = 0.02
