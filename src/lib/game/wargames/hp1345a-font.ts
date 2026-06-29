/* eslint-disable no-bitwise -- unpacking the bit-packed HP1345A character ROM is inherently a
   bitwise operation (delta magnitude, sign bit, pen-control bit, address synthesis); arithmetic
   substitutes would be slower and far less readable. Scoped to this decoder only. */
// Decoder for the HP1345A vector character ROM (see ./hp1345a-rom). It turns a character code or
// string into 2D stroke geometry — the WarGames NORAD big-board font drawn as line segments rather
// than a raster/outline font, so it stays crisp and cheap to update inside the Three.js scene.
//
// Coordinate space (font units): x grows right, y grows up, the baseline sits at y = 0 and capitals
// reach y = GLYPH_CAP_HEIGHT. Consumers scale by (world cap height / GLYPH_CAP_HEIGHT).
import { INDEX_BYTES, STROKE_BYTES } from './hp1345a-rom'

export type Point = readonly [number, number]
export type Polyline = ReadonlyArray<Point>

// Character-cell metrics measured from the ROM (font units).
export const GLYPH_CAP_HEIGHT = 18
export const GLYPH_ADVANCE = 16

// Stroke-byte layout: the low 6 bits are a delta magnitude, bit 6 is its sign, and the high bit is
// a pen flag (clear on the dx byte starts a new polyline; set on the dy byte ends the glyph).
const DELTA_MASK = 0x3f
const SIGN_BIT = 0x40
const PEN_BIT = 0x80
const STROKE_STEP = 2

// Address synthesis from a character code into the stroke table (mirrors PHK's ROM addressing).
const LOW_FIVE_MASK = 0x1f
const HIGH_THREE_MASK = 0xe0
const SECTION_SHIFT = 1
const ADDRESS_SHIFT = 2
const BANK_LOW_SHIFT = 5
const BANK_HIGH_SHIFT = 6
const BANK_BIT = 10
const PLANE_SHIFT = 7
const PLANE_BIT = 11
const ODD_PARITY = 1
const COORDS_PER_VERTEX = 2
const CENTER_DIVISOR = 2

function stroke_address(code: number): number {
	const entry = (code & LOW_FIVE_MASK) | ((code & HIGH_THREE_MASK) << SECTION_SHIFT)
	let address = (INDEX_BYTES[entry] ?? 0) << ADDRESS_SHIFT

	address |= ((ODD_PARITY ^ (code >> BANK_LOW_SHIFT) ^ (code >> BANK_HIGH_SHIFT)) & 1) << BANK_BIT
	address |= ((code >> PLANE_SHIFT) & 1) << PLANE_BIT

	return address
}

function signed_delta(byte: number): number {
	const magnitude = byte & DELTA_MASK

	return byte & SIGN_BIT ? -magnitude : magnitude
}

// Decide which polyline the next point belongs to. A pen-up (PEN_BIT clear on the dx byte) opens a
// fresh polyline; a glyph that opens with a draw is seeded at the (0, 0) origin so its first segment
// is not lost; otherwise the current polyline continues.
function open_polyline(
	polylines: Array<Array<Point>>,
	current: Array<Point>,
	head: number,
): Array<Point> {
	if ((head & PEN_BIT) === 0) {
		const next: Array<Point> = []

		polylines.push(next)

		return next
	}

	if (polylines.length === 0) {
		const seed: Array<Point> = [[0, 0]]

		polylines.push(seed)

		return seed
	}

	return current
}

// Walk the stroke list for one glyph, accumulating relative deltas into absolute polylines. The dy
// PEN_BIT ends the glyph; a zero pair is the empty/terminator entry.
function decode_glyph(code: number): Array<Polyline> {
	let address = stroke_address(code)
	const polylines: Array<Array<Point>> = []
	const visited = new Set<number>()
	let x = 0
	let y = 0
	let current: Array<Point> = []

	while (!visited.has(address)) {
		const head = STROKE_BYTES[address] ?? 0
		const tail = STROKE_BYTES[address + 1] ?? 0

		if (head === 0 && tail === 0) break

		visited.add(address)
		current = open_polyline(polylines, current, head)
		x += signed_delta(head)
		y += signed_delta(tail)
		current.push([x, y])

		if ((tail & PEN_BIT) !== 0) break

		address += STROKE_STEP
	}

	return polylines
}

// Lay a string out left to right, offsetting each glyph by GLYPH_ADVANCE. Returns absolute polylines
// in font units; an unknown/blank glyph simply contributes no polylines but still advances the pen.
function layout_text(text: string): Array<Polyline> {
	const polylines: Array<Polyline> = []
	let index = 0

	for (const character of text) {
		const origin_x = index * GLYPH_ADVANCE
		const strokes = decode_glyph(character.codePointAt(0) ?? 0)

		for (const stroke of strokes) {
			polylines.push(stroke.map(([x, y]) => [origin_x + x, y] as const))
		}

		index += 1
	}

	return polylines
}

// Append every drawn edge of one polyline as (ax, ay, bx, by) tuples; isolated move points draw
// nothing and contribute no segment.
function push_segments(points: Array<number>, polyline: Polyline): void {
	for (let index = 1; index < polyline.length; index += 1) {
		const start = polyline[index - 1]
		const end = polyline[index]

		if (start && end) points.push(start[0], start[1], end[0], end[1])
	}
}

// Flatten polylines into line-segment endpoint pairs: [ax, ay, bx, by, ...].
function to_segment_points(polylines: ReadonlyArray<Polyline>): Array<number> {
	const points: Array<number> = []

	for (const polyline of polylines) push_segments(points, polyline)

	return points
}

// Build a flat THREE-ready position buffer ([x, y, z, ...], consecutive pairs = one segment) for a
// string, scaled so capitals are `size` tall and centred on the origin (like troika anchor
// center/middle), which keeps placement in the scene identical to the existing text components.
function to_line_positions(text: string, size: number): Array<number> {
	const scale = size / GLYPH_CAP_HEIGHT
	const center_x = (text.length * GLYPH_ADVANCE) / CENTER_DIVISOR
	const center_y = GLYPH_CAP_HEIGHT / CENTER_DIVISOR
	const flat = to_segment_points(layout_text(text))
	const positions: Array<number> = []

	for (let index = 0; index < flat.length; index += COORDS_PER_VERTEX) {
		const px = ((flat[index] ?? 0) - center_x) * scale
		const py = ((flat[index + 1] ?? 0) - center_y) * scale

		positions.push(px, py, 0)
	}

	return positions
}

export const hp1345a_font = {
	decode_glyph,
	layout_text,
	to_segment_points,
	to_line_positions,
}
