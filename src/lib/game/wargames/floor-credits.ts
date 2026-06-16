import { credits_scroll, HALF_D } from '@joshuafolkken/game-kit'
import { CREDITS_LINE_COUNT } from '$lib/game/credits'

export { CREDITS_TEXT as FLOOR_CREDITS_TEXT } from '$lib/game/credits'

// Michael Walden's screen-transcribed WarGames (1983) title font — Raster variant (baked-in
// CRT scanlines) + Proportional, redesigned "2" cut, WOFF format (file: WarGames Title R W P
// 2.woff; troika-three-text supports .ttf/.otf/.woff but not .woff2), per issue #37. Licensed
// CC BY-NC-SA 4.0; the BY attribution to Michael Walden lives in the credits roll itself (see
// $lib/game/credits). Handed to game-kit's FloorCredits via `font`.
export const FLOOR_CREDITS_FONT_URL = '/fonts/WarGamesTitle.woff'

// Pure red recommended by the WarGames Title font's author for best results
// (https://mw.rat.bz/wgtitle/ — "use these fonts with a red (#FF0000)"). This supersedes
// issue #37's #ff3b30 (Apple system red), which read too bright/orange. Handed to game-kit's
// FloorCredits via its `color` override prop.
export const FLOOR_CREDITS_COLOR = '#ff0000'

// FloorCredits requires is_alt, but FLOOR_CREDITS_COLOR overrides the palette it would
// otherwise pick, so this value no longer drives the rendered color.
export const FLOOR_CREDITS_IS_ALT = true

// Scroll the roll from beyond the room's far edge to beyond its near edge so the whole
// list passes under the player's feet, then loops (matches the pre-WarGames scene).
const { start_z, end_z } = credits_scroll.make_credits_scroll_bounds(CREDITS_LINE_COUNT, HALF_D)

export const FLOOR_CREDITS_START_Z = start_z
export const FLOOR_CREDITS_END_Z = end_z
