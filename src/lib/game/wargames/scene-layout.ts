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

// Lighting. Bright enough that the room reads as a faintly-lit interior rather than a
// black void (see issue #27), while staying dim enough to keep the WOPR night mood.
export const AMBIENT_INTENSITY = 0.6
export const POINT_INTENSITY = 1.6
export const POINT_Y = 2.6
export const POINT_POS: [number, number, number] = [0, POINT_Y, 0]

// Content sits a hair in front of the translucent glass plane to avoid z-fighting.
export const CONTENT_Z_OFFSET = 0.02

// NORAD banner — HP1345A vector-font header floating above the center screen. The center screen top
// is at SCREEN_Y + CENTER_H / 2 = 2.5; the banner sits clear of it with a gap (and below the 3-high
// ceiling). See scene-layout.test.ts for the no-overlap guard.
const BANNER_Y = 2.75
export const BANNER_SIZE = 0.22
export const BANNER_POS: [number, number, number] = [0, BANNER_Y, CENTER_Z]
