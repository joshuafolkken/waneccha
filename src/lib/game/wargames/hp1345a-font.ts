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
import { WOPR_CONSOLE_GLYPHS } from './wopr-console-glyphs'

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
function decode_rom_glyph(code: number): Array<Polyline> {
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

// Resolve one glyph to absolute polylines: hand-authored WOPR console overrides take precedence
// (returned as fresh copies so callers can't mutate the shared table), otherwise decode the ROM.
function decode_glyph(code: number): Array<Polyline> {
	const override = WOPR_CONSOLE_GLYPHS.get(code)
	if (override) return override.map((line) => [...line])

	return decode_rom_glyph(code)
}

// Lay a string out left to right, offsetting each glyph by GLYPH_ADVANCE. Returns absolute polylines
// in font units; an unknown/blank glyph simply contributes no polylines but still advances the pen.
// `condense` (<1) scales each glyph's own width only; `letter_spacing` scales the GLYPH_ADVANCE pitch
// between glyphs. Both default to 1, so glyph height stays fixed regardless.
function layout_text(text: string, condense = 1, letter_spacing = 1): Array<Polyline> {
	const polylines: Array<Polyline> = []
	let index = 0

	for (const character of text) {
		const origin_x = index * GLYPH_ADVANCE * letter_spacing
		const strokes = decode_glyph(character.codePointAt(0) ?? 0)

		for (const stroke of strokes) {
			polylines.push(stroke.map(([x, y]) => [origin_x + x * condense, y] as const))
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

// Layout options for laid-out text. align/valign default to 'center'/'middle' (troika-like, keeps
// existing placements); 'left'/'top' anchors the block's top-left at the origin (terminal screens).
// condense scales each glyph's width; letter_spacing scales the GLYPH_ADVANCE pitch; line_spacing
// scales the LINE_SPACING_FACTOR — all default to 1 (no change).
export interface TextLayout {
	align?: 'center' | 'left'
	valign?: 'middle' | 'top'
	condense?: number
	letter_spacing?: number
	line_spacing?: number
}

const DEFAULT_LAYOUT: Required<TextLayout> = {
	align: 'center',
	valign: 'middle',
	condense: 1,
	letter_spacing: 1,
	line_spacing: 1,
}

// Fill any omitted layout options with their defaults (keeps the layout funcs simple — no per-field
// default branches inflating their complexity).
function resolve_layout(layout: TextLayout): Required<TextLayout> {
	return { ...DEFAULT_LAYOUT, ...layout }
}

// Build a flat THREE-ready position buffer ([x, y, z, ...], consecutive pairs = one segment) for one
// line, scaled so capitals are `size` tall. 'center' centres the line on x=0; 'left' anchors its left
// edge at x=0. The line is always centred on y=0 (callers stack lines via to_block_positions).
function to_line_positions(text: string, size: number, layout: TextLayout = {}): Array<number> {
	const { align, condense, letter_spacing } = resolve_layout(layout)
	const scale = size / GLYPH_CAP_HEIGHT
	const advance = GLYPH_ADVANCE * letter_spacing
	const origin_x = align === 'left' ? 0 : (text.length * advance) / CENTER_DIVISOR
	const center_y = GLYPH_CAP_HEIGHT / CENTER_DIVISOR
	const flat = to_segment_points(layout_text(text, condense, letter_spacing))
	const positions: Array<number> = []

	for (let index = 0; index < flat.length; index += COORDS_PER_VERTEX) {
		const px = ((flat[index] ?? 0) - origin_x) * scale
		const py = ((flat[index + 1] ?? 0) - center_y) * scale

		positions.push(px, py, 0)
	}

	return positions
}

// Vertical distance between stacked text lines, as a multiple of the cap size.
export const LINE_SPACING_FACTOR = 1.4
const VERTEX_STRIDE = 3

// y of the first line's centre: 'middle' centres the whole block on the origin; 'top' puts the first
// line's top edge at y=0 so the block grows downward.
function first_line_offset(
	line_count: number,
	step: number,
	size: number,
	valign: TextLayout['valign'],
): number {
	if (valign === 'top') return -size / CENTER_DIVISOR

	return ((line_count - 1) * step) / CENTER_DIVISOR
}

// Lay out text that may contain '\n' as one position buffer: each line is anchored horizontally per
// `layout.align`, then stacked top-to-bottom and offset vertically per `layout.valign`.
function to_block_positions(text: string, size: number, layout: TextLayout = {}): Array<number> {
	const { align, valign, condense, letter_spacing, line_spacing } = resolve_layout(layout)
	const lines = text.split('\n')
	const step = size * LINE_SPACING_FACTOR * line_spacing
	const first_offset = first_line_offset(lines.length, step, size, valign)
	const positions: Array<number> = []

	for (const [index, line] of lines.entries()) {
		const y_offset = first_offset - index * step
		const line_positions = to_line_positions(line, size, { align, condense, letter_spacing })

		for (let base = 0; base < line_positions.length; base += VERTEX_STRIDE) {
			positions.push(line_positions[base] ?? 0, (line_positions[base + 1] ?? 0) + y_offset, 0)
		}
	}

	return positions
}

// Largest cap size at which `text` fits inside a content box: bounded by its longest line (width) and
// its line count incl. blank lines (height). `layout` MUST match the render-time layout — letter_spacing
// widens the advance pitch and line_spacing widens the inter-line gaps, so ignoring them would
// over-estimate the fit and overflow the box. condense (<=1) only shrinks each glyph within its advance
// pitch, so the advance-based width estimate stays conservative. Lets a screen auto-shrink text to fit.
function fit_size(
	text: string,
	content_width: number,
	content_height: number,
	layout: TextLayout = {},
): number {
	const { letter_spacing, line_spacing } = resolve_layout(layout)
	const advance = GLYPH_ADVANCE * letter_spacing
	const lines = text.split('\n')
	const max_chars = Math.max(...lines.map((line) => line.length))
	const width_size =
		max_chars > 0 ? (content_width * GLYPH_CAP_HEIGHT) / (max_chars * advance) : content_height
	const height_factor = (lines.length - 1) * LINE_SPACING_FACTOR * line_spacing + 1

	return Math.min(width_size, content_height / height_factor)
}

export const hp1345a_font = {
	decode_glyph,
	layout_text,
	to_segment_points,
	to_line_positions,
	to_block_positions,
	fit_size,
}
