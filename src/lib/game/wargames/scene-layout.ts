// World-space layout for the WarGames control room. The first-person Player camera spawns
// behind the "click to start" backdrop and looks down -Z at the three screens.
import { ROOM_H } from '@joshuafolkken/game-kit'
import { LINE_SPACING_FACTOR } from './hp1345a-font'

const HALF = 2
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

// NORAD banner — HP1345A vector-font header floating above the center screen. It can render up to
// BANNER_MAX_LINES stacked lines (see Hp1345aText multi-line). The center screen top is at
// SCREEN_Y + CENTER_H / 2 = 2.5; the banner block is centred in the gap between that and the 3-high
// ceiling, so it clears both. See scene-layout.test.ts for the no-overlap guard.
export const BANNER_SIZE = 0.1
const BANNER_MAX_LINES = 3
// Total vertical extent of a full BANNER_MAX_LINES block: one cap height plus the inter-line gaps.
export const BANNER_BLOCK_H = BANNER_SIZE * (1 + (BANNER_MAX_LINES - 1) * LINE_SPACING_FACTOR)
const SCREEN_TOP = SCREEN_Y + CENTER_H / HALF
const BANNER_Y = (SCREEN_TOP + ROOM_H) / HALF
export const BANNER_POS: [number, number, number] = [0, BANNER_Y, CENTER_Z]

// Terminal — a thick white-bordered CRT panel (see TerminalScreen) showing the WOPR message, placed
// front-and-centre between the player spawn and the center screen, facing the player so the message
// reads head-on, at the movie screen's aspect ratio.
const TERMINAL_ASPECT = 1.45
export const TERMINAL_H = 1.7
export const TERMINAL_W = TERMINAL_H * TERMINAL_ASPECT
const TERMINAL_Z = 0.5
export const TERMINAL_POS: [number, number, number] = [0, SCREEN_Y, TERMINAL_Z]
export const TERMINAL_ROT = 0
