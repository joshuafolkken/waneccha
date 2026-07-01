// Vector letterform overrides for the NORAD banner, redrawn to match the WarGames (1983) WOPR
// console screen rather than the HP1345A NORAD big-board ROM. `decode_glyph` (see ./hp1345a-font)
// consults this table before the hardware ROM, so ONLY these characters change; every other glyph
// (notably 'H', which already matches) still renders straight from the HP1345A ROM.
//
// Construction rules read off the screen font:
//   - Strokes are HORIZONTAL or VERTICAL; the only diagonals are short 45° corner chamfers (plus the
//     inherently-diagonal A/K/M/N/R/V/W/X/Y/Z strokes). No curves — round letters are octagons.
//   - MONOSPACE: every glyph fills the same width box (x 0..12), matching the ROM 'H' beside it.
//
// Each glyph is a terse stroke spec (kept compact so all 26 letters fit one readable file): polylines
// are separated by '|', points within a polyline by spaces, and a point's x/y by a comma. Font units
// are y-up with the baseline at y=0 and capitals at y=18 (= GLYPH_CAP_HEIGHT).
import type { Point, Polyline } from './hp1345a-font'

const GLYPH_STROKES: ReadonlyArray<readonly [string, string]> = [
	// Vertical sides, 45° chamfered head corners (2×2, matching the P/R bowl corners) to a flat top,
	// mid crossbar.
	['A', '0,0 0,16 2,18 10,18 12,16 12,0 | 0,7 12,7'],
	// Stem (inset to x=2) + two EQUAL right-bulging bowls; the top and bottom bars overhang LEFT of
	// the stem to x=0.
	['B', '2,0 2,18 | 1,18 10,18 12,16 12,11 10,9 2,9 | 1,0 10,0 12,2 12,7 10,9'],
	// Octagonal C, open on the right. Its left side (verticals + 3.5×5.25 chamfers) matches O's left
	// side, and both right claws use the same 45° 2×2 bend as G's top-right claw.
	['C', '11,16 9,18 3.5,18 0,12.75 0,5.25 3.5,0 9,0 11,2'],
	// Stem (inset to x=2) + single right-bulging bowl; top/bottom bars overhang LEFT to x=1, with the
	// same 2×2 corner chamfers and right edge (x=12) as 'B' so the two share one style.
	['D', '2,0 2,18 | 1,18 10,18 12,16 12,2 10,0 1,0'],
	// Top/bottom bars (slightly inset from the cell edge) + a short middle bar.
	['E', '11,18 0,18 0,0 11,0 | 0,9 5,9'],
	// Like E without the bottom bar; short middle bar.
	['F', '11,18 0,18 0,0 | 0,9 5,9'],
	// Octagonal C with a horizontal inner bar at mid-right; the top-RIGHT claw uses S's 45° 2×2 bend,
	// the left side (verticals + 3.5×5.25 chamfers) matches O's left side, and the bottom-RIGHT corner
	// is a square right angle (not chamfered) where the bottom bar meets the right side to the inner bar.
	['G', '11,16 9,18 3.5,18 0,12.75 0,5.25 3.5,0 11.5,0 11.5,8 7.5,8'],
	// Centred vertical stem with short horizontal serif bars top and bottom.
	['I', '4,18 8,18 | 6,18 6,0 | 4,0 8,0'],
	// Centred stem under a symmetric horizontal top bar (equal overhang each side), hooking left at
	// the baseline.
	['J', '4,18 8,18 | 6,18 6,2.5 4,0 2,0 1,1.5'],
	// Stem + a short horizontal joining it to the arm/leg junction (offset right of the stem); the
	// upper arm and lower leg fan out from that junction.
	['K', '0,0 0,18 | 10,18 2.5,9 0,9 | 2.5,9 10,0'],
	// Stem + full-width bottom bar.
	['L', '0,18 0,0 12,0'],
	// Vertical sides, shallow inner V to mid-height.
	['M', '0,0 0,18 6,9 12,18 12,0'],
	// Vertical sides joined by the full diagonal.
	['N', '0,0 0,18 12,0 12,18'],
	// Closed octagon; the four corner chamfers keep the 2:3 (dx:dy) slope of the M diagonals but run
	// a touch longer (insets 3.5×5.25) so the diagonals read a little more prominently than Q's.
	['O', '3.5,0 8.5,0 12,5.25 12,12.75 8.5,18 3.5,18 0,12.75 0,5.25 3.5,0'],
	// Stem + 45°-chamfered (2×2) bowl filling the upper half; bowl closes at y=9 (level with the H
	// crossbar).
	['P', '0,0 0,18 10,18 12,16 12,11 10,9 0,9'],
	// Octagon (2:3-slope corner chamfers, slightly shorter than O's) + short diagonal tail at the
	// lower right.
	['Q', '3,0 9,0 12,4.5 12,13.5 9,18 3,18 0,13.5 0,4.5 3,0 | 8,5 12,0'],
	// Stem + upper bowl identical to P's (45° 2×2 corners, right edge at the cell's x=12 so R spaces
	// like P), closing at y=9 level with the H crossbar, + diagonal leg from right of the stem down to
	// a foot lifted just off the baseline.
	['R', '0,0 0,18 | 0,18 10,18 12,16 12,11 10,9 0,9 | 3,9 11,0.5'],
	// Segment S: horizontal top/middle/bottom bars, upper-left & lower-right verticals; every corner
	// chamfer is 45° 2×2, matching R's bowl. Point-symmetric about the centre.
	['S', '11,16 9,18 3,18 1,16 1,11 3,9 9,9 11,7 11,2 9,0 3,0 1,2'],
	// Top bar + centred stem.
	['T', '0,18 12,18 | 6,18 6,0'],
	// Vertical sides + chamfered base.
	['U', '0,18 0,3 3,0 9,0 12,3 12,18'],
	// Two diagonals to the baseline centre.
	['V', '0,18 6,0 12,18'],
	// Vertical mirror of M: vertical sides, inner peak rising to mid-height.
	['W', '0,18 0,0 6,9 12,0 12,18'],
	// Crossed diagonals.
	['X', '0,18 12,0 | 0,0 12,18'],
	// Diagonal arms to centre, then a vertical stem down.
	['Y', '0,18 6,9 6,0 | 12,18 6,9'],
	// Top bar + diagonal + bottom bar.
	['Z', '0,18 12,18 0,0 12,0'],
	// Chamfered hook over the top to a short central stem, then a detached dot.
	['?', '1,14 1,16 3,18 9,18 11,16 11,13 8,11 6.5,9.5 6.5,7 | 6.5,2 6.5,1'],
	// Period — a small round dot sitting at the baseline, shifted right toward the glyph centre to
	// match the WOPR screen. A near-zero-length segment renders as a round-capped circle (the tiny
	// 0.2 span keeps it round rather than an oval capsule); y=0 drops it onto the baseline.
	['.', '5.9,0 6.1,0'],
]

// Parse one stroke spec into absolute polylines (see the format note above).
function parse_glyph(spec: string): Array<Polyline> {
	const polylines: Array<Polyline> = []

	for (const segment of spec.split('|')) {
		const points: Array<Point> = []

		for (const pair of segment.trim().split(/\s+/u)) {
			const [x, y] = pair.split(',')

			points.push([Number(x), Number(y)])
		}

		polylines.push(points)
	}

	return polylines
}

export const WOPR_CONSOLE_GLYPHS: ReadonlyMap<number, ReadonlyArray<Polyline>> = new Map(
	GLYPH_STROKES.map(
		([character, spec]) => [character.codePointAt(0) ?? 0, parse_glyph(spec)] as const,
	),
)
