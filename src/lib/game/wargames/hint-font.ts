// Michael Walden's screen-transcribed WarGames (1983) terminal font — Raster variant (baked-in
// CRT scanlines), monospaced, WOFF format (file: WarGames Terminal R W.woff; troika-three-text
// supports .ttf/.otf/.woff but not .woff2), per issue #37. Licensed CC BY-NC-SA 4.0; the BY
// attribution to Michael Walden lives in the credits roll itself (see $lib/game/credits).
// Handed to game-kit's GameScene via its `hint_font` prop, which themes the pre-start controls
// hint (PUSH/CLICK/TAP TO START) and the WASD/ESC/Z keyboard letters.
//
// MODIFIED (CC BY-NC-SA ShareAlike — change disclosure): the bundled .woff is normalized for
// game-kit's controls overlay, which renders at a fixed font size tuned for the default
// PressStart2P face and centers each glyph with troika-three-text `anchorY="middle"` (centering
// on the glyph's em placement, not on font metrics). Upstream WarGames Terminal glyphs are small
// within the em (cap ~68% of the 1900 em) and sit high, so they rendered both too small and above
// each key center. Every glyph outline + advance is scaled up ~1.46x to match the previous
// PressStart2P size, then shifted so the caps center in the keys. Same family/license/attribution.
export const HINT_FONT_URL = '/fonts/WarGamesTerminal.woff'
