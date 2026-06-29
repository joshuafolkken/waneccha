import { describe, expect, it } from 'vitest'
import { GLYPH_ADVANCE, GLYPH_CAP_HEIGHT, hp1345a_font } from './hp1345a-font'

const SEGMENT_STRIDE = 4

function code(character: string): number {
	return character.codePointAt(0) ?? 0
}

describe('hp1345a_font.decode_glyph', () => {
	it('seeds the origin so an opening draw stroke is not lost (regression: missing left bar of H)', () => {
		// H is three bars: left vertical, right vertical, crossbar — plus a final pen-up advance.
		expect(hp1345a_font.decode_glyph(code('H'))).toEqual([
			[
				[0, 0],
				[0, 18],
			],
			[
				[12, 0],
				[12, 18],
			],
			[
				[0, 9],
				[12, 9],
			],
			[[18, 0]],
		])
	})

	it('uses a y-up baseline: capitals span 0..GLYPH_CAP_HEIGHT', () => {
		const ys = hp1345a_font.decode_glyph(code('H')).flatMap((line) => line.map(([, y]) => y))

		expect(Math.min(...ys)).toBe(0)
		expect(Math.max(...ys)).toBe(GLYPH_CAP_HEIGHT)
	})

	it('draws nothing for an unmapped control character', () => {
		expect(hp1345a_font.to_segment_points(hp1345a_font.decode_glyph(0))).toEqual([])
	})
})

describe('hp1345a_font.to_segment_points', () => {
	it('emits one segment per drawn edge and drops isolated move points', () => {
		// H has 3 drawn edges (left, right, crossbar); the trailing advance point draws nothing.
		const points = hp1345a_font.to_segment_points(hp1345a_font.decode_glyph(code('H')))

		expect(points).toEqual([0, 0, 0, 18, 12, 0, 12, 18, 0, 9, 12, 9])
	})

	it('produces a flat buffer of (ax, ay, bx, by) tuples', () => {
		const points = hp1345a_font.to_segment_points(hp1345a_font.layout_text('WOPR'))

		expect(points.length % SEGMENT_STRIDE).toBe(0)
		expect(points.length).toBeGreaterThan(0)
	})

	it('treats a space as advance-only (no drawn segments)', () => {
		const space = hp1345a_font.decode_glyph(code(' '))

		expect(hp1345a_font.to_segment_points(space)).toEqual([])
	})
})

describe('hp1345a_font.to_line_positions', () => {
	const VERTEX_COORDS = 3
	const VERTICES_PER_SEGMENT = 2
	const Z_INDEX = 2
	const Y_INDEX = 1

	it('expands each 2D segment endpoint into an (x, y, z=0) triple', () => {
		const segments = hp1345a_font.to_segment_points(hp1345a_font.layout_text('WOPR'))
		const positions = hp1345a_font.to_line_positions('WOPR', 1)
		const expected = (segments.length / SEGMENT_STRIDE) * VERTICES_PER_SEGMENT * VERTEX_COORDS

		expect(positions).toHaveLength(expected)
	})

	it('keeps every vertex on the z = 0 plane', () => {
		const zs = hp1345a_font
			.to_line_positions('WOPR', 1)
			.filter((_, index) => index % VERTEX_COORDS === Z_INDEX)

		expect(zs.every((z) => z === 0)).toBe(true)
	})

	it('scales capitals to the requested size and centres on the origin', () => {
		const size = 4
		const ys = hp1345a_font
			.to_line_positions('H', size)
			.filter((_, index) => index % VERTEX_COORDS === Y_INDEX)

		// Caps run from baseline to GLYPH_CAP_HEIGHT, centred -> [-size/2, +size/2].
		expect(Math.max(...ys)).toBeCloseTo(size / 2)
		expect(Math.min(...ys)).toBeCloseTo(-size / 2)
	})
})

describe('hp1345a_font.layout_text', () => {
	it('advances each glyph by GLYPH_ADVANCE along x', () => {
		const second_min_x = Math.min(
			...hp1345a_font
				.layout_text('HH')
				.flatMap((line) => line.map(([x]) => x))
				.filter((x) => x >= GLYPH_ADVANCE),
		)

		// The second H starts a full advance to the right of the first.
		expect(second_min_x).toBe(GLYPH_ADVANCE)
	})

	it('skips unmapped characters without throwing while still advancing', () => {
		const spaced = hp1345a_font.to_segment_points(hp1345a_font.layout_text('H H'))
		const solid = hp1345a_font.to_segment_points(hp1345a_font.layout_text('HH'))

		// Same two H glyphs are drawn either way; the space only shifts the third column.
		expect(spaced).toHaveLength(solid.length)
	})
})
