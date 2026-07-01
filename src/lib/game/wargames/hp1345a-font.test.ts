import { describe, expect, it } from 'vitest'
import { GLYPH_ADVANCE, GLYPH_CAP_HEIGHT, hp1345a_font, LINE_SPACING_FACTOR } from './hp1345a-font'
import { WOPR_CONSOLE_GLYPHS } from './wopr-console-glyphs'

const SEGMENT_STRIDE = 4

function code(character: string): number {
	return character.codePointAt(0) ?? 0
}

function span(values: Array<number>): number {
	return Math.max(...values) - Math.min(...values)
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

describe('hp1345a_font.decode_glyph WOPR console overrides', () => {
	it('returns the override geometry for a restyled banner character (G)', () => {
		const expected = WOPR_CONSOLE_GLYPHS.get(code('G'))

		expect(hp1345a_font.decode_glyph(code('G'))).toEqual(expected?.map((line) => [...line]))
	})

	it('still decodes a non-overridden character (H) straight from the ROM', () => {
		// H is intentionally left on the ROM, so its decoded shape keeps the trailing advance point.
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

	it('returns a fresh copy so mutating the result cannot corrupt the override table', () => {
		const first = hp1345a_font.decode_glyph(code('G'))

		first[0] = []

		expect(hp1345a_font.decode_glyph(code('G'))[0]?.length).toBeGreaterThan(0)
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

describe('hp1345a_font.to_block_positions', () => {
	const VERTEX_COORDS = 3
	const Y_INDEX = 1

	function ys(positions: Array<number>): Array<number> {
		return positions.filter((_, index) => index % VERTEX_COORDS === Y_INDEX)
	}

	it('returns the single-line layout unchanged when there is no newline', () => {
		expect(hp1345a_font.to_block_positions('WOPR', 1)).toEqual(
			hp1345a_font.to_line_positions('WOPR', 1),
		)
	})

	it('stacks lines vertically: the block is taller than one line and the first line sits highest', () => {
		const size = 4
		const single = ys(hp1345a_font.to_line_positions('H', size))
		const block = ys(hp1345a_font.to_block_positions('H\nH', size))

		expect(span(block)).toBeGreaterThan(span(single))
		expect(Math.max(...block)).toBeGreaterThan(Math.max(...single))
		expect(Math.min(...block)).toBeLessThan(Math.min(...single))
	})

	it('left/top anchors the block at the origin (no vertices left of or above it)', () => {
		const positions = hp1345a_font.to_block_positions('AB\nCDE', 4, {
			align: 'left',
			valign: 'top',
		})
		const xs = positions.filter((_, index) => index % VERTEX_COORDS === 0)

		expect(Math.min(...xs)).toBeGreaterThanOrEqual(0)
		expect(Math.max(...ys(positions))).toBeLessThanOrEqual(0)
	})

	it('line_spacing widens the gap between stacked lines (y span grows)', () => {
		const size = 4
		const normal = ys(hp1345a_font.to_block_positions('H\nH', size))
		const wide = ys(hp1345a_font.to_block_positions('H\nH', size, { line_spacing: 2 }))

		expect(span(wide)).toBeGreaterThan(span(normal))
	})
})

describe('hp1345a_font.fit_size', () => {
	const EPSILON = 1e-9
	const LONGEST_CHARS = 10
	const LINE_COUNT = 3

	it('shrinks text so its longest line and line count both fit the content box', () => {
		const content_width = 5
		const content_height = 3
		// 10-char longest line, 3 lines (including the blank middle line).
		const size = hp1345a_font.fit_size('AAAAAAAAAA\n\nB', content_width, content_height)
		const longest_line = LONGEST_CHARS * GLYPH_ADVANCE * (size / GLYPH_CAP_HEIGHT)
		const block_height = ((LINE_COUNT - 1) * LINE_SPACING_FACTOR + 1) * size

		expect(size).toBeGreaterThan(0)
		expect(longest_line).toBeLessThanOrEqual(content_width + EPSILON)
		expect(block_height).toBeLessThanOrEqual(content_height + EPSILON)
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

	it('condense narrows each glyph width but keeps the GLYPH_ADVANCE pitch and y', () => {
		const condense = 0.5
		const full = hp1345a_font.layout_text('HH').flat()
		const slim = hp1345a_font.layout_text('HH', condense).flat()

		// The second glyph still starts a full advance to the right (letter spacing unchanged).
		const second_min_x = Math.min(...slim.map(([x]) => x).filter((x) => x >= GLYPH_ADVANCE))

		expect(second_min_x).toBe(GLYPH_ADVANCE)

		// Within the first glyph, x is scaled by condense while y is untouched.
		for (const [index, [x, y]] of full.entries()) {
			if (x >= GLYPH_ADVANCE) continue

			expect(slim[index]?.[0]).toBeCloseTo(x * condense)
			expect(slim[index]?.[1]).toBe(y)
		}
	})

	it('letter_spacing scales the GLYPH_ADVANCE pitch between glyphs', () => {
		const letter_spacing = 2
		const wide = hp1345a_font.layout_text('HH', 1, letter_spacing).flat()
		const widened_pitch = GLYPH_ADVANCE * letter_spacing
		const second_min_x = Math.min(...wide.map(([x]) => x).filter((x) => x >= widened_pitch))

		// The second glyph now starts a doubled advance to the right.
		expect(second_min_x).toBe(widened_pitch)
	})
})
