import { describe, expect, it } from 'vitest'
import { GLYPH_CAP_HEIGHT } from './hp1345a-font'
import { WOPR_CONSOLE_GLYPHS } from './wopr-console-glyphs'

function code(character: string): number {
	return character.codePointAt(0) ?? 0
}

// The full uppercase alphabet is restyled EXCEPT 'H', which the ROM already matches (see the H
// regression test in hp1345a-font.test). '?' is restyled too.
// cspell:ignore ABCDEFGIJKLMNOPQRSTUVWXYZ
const ALPHABET_EXCEPT_H_PLUS_QUESTION = 'ABCDEFGIJKLMNOPQRSTUVWXYZ?'

describe('WOPR_CONSOLE_GLYPHS', () => {
	it('overrides the full uppercase alphabet (except H) plus the question mark', () => {
		for (const character of ALPHABET_EXCEPT_H_PLUS_QUESTION) {
			expect(WOPR_CONSOLE_GLYPHS.has(code(character))).toBe(true)
		}
	})

	it('leaves H on the ROM (not overridden)', () => {
		expect(WOPR_CONSOLE_GLYPHS.has(code('H'))).toBe(false)
	})

	it('defines each glyph as at least one non-empty polyline of finite points', () => {
		for (const lines of WOPR_CONSOLE_GLYPHS.values()) {
			expect(lines.length).toBeGreaterThan(0)
			expect(lines.every((line) => line.length >= 2)).toBe(true)

			for (const [x, y] of lines.flat()) {
				expect(Number.isFinite(x) && Number.isFinite(y)).toBe(true)
			}
		}
	})

	it('keeps every vertex inside the font cell so overrides align with ROM glyphs', () => {
		for (const lines of WOPR_CONSOLE_GLYPHS.values()) {
			for (const [x, y] of lines.flat()) {
				expect(x).toBeGreaterThanOrEqual(0)
				expect(y).toBeGreaterThanOrEqual(0)
				expect(y).toBeLessThanOrEqual(GLYPH_CAP_HEIGHT)
			}
		}
	})
})

// Period-dot bounds (font units): a small ROUND dot sitting at the baseline, positioned right of the
// cell's left-of-centre. A tight width keeps it round (not an oval capsule); a low top keeps it low.
const DOT_ROUND_MAX = 0.5
const DOT_BASELINE_MAX = 0.5
const DOT_MIN_CENTER_X = 5
const LEG_MIN_START_X = 3
// The cell's right edge (font units). Bowl letters R and P fill to here so they space evenly.
const CELL_RIGHT_EDGE = 12
// O's octagon diagonals keep a 2:3 (dx:dy) slope; lengthening pushes them past the old ~5.4 length.
const O_DIAGONAL_SLOPE = 1.5
const O_DIAGONAL_MIN_LEN = 6

function vertices(character: string): Array<readonly [number, number]> {
	return (WOPR_CONSOLE_GLYPHS.get(code(character)) ?? []).flat()
}

function distinct_x_at(character: string, y_value: number): number {
	return new Set(
		vertices(character)
			.filter(([, y]) => y === y_value)
			.map(([x]) => x),
	).size
}

// Corner chamfers are the SHORT diagonal segments; this bound excludes R's long diagonal leg.
const CHAMFER_MAX_LEN = 4

type Delta = readonly [number, number]

// (dx, dy) deltas of every consecutive segment in one polyline.
function line_deltas(line: ReadonlyArray<readonly [number, number]>): Array<Delta> {
	const deltas: Array<Delta> = []

	for (let index = 1; index < line.length; index += 1) {
		const [ax, ay] = line[index - 1] ?? [0, 0]
		const [bx, by] = line[index] ?? [0, 0]

		deltas.push([bx - ax, by - ay])
	}

	return deltas
}

// A short diagonal segment (both runs non-zero) is a corner chamfer.
function is_chamfer([dx, dy]: Delta): boolean {
	return dx !== 0 && dy !== 0 && Math.hypot(dx, dy) <= CHAMFER_MAX_LEN
}

// Collect the (dx, dy) deltas of a glyph's short diagonal corner chamfers.
function chamfer_deltas(character: string): Array<Delta> {
	return (WOPR_CONSOLE_GLYPHS.get(code(character)) ?? [])
		.flatMap((line) => line_deltas(line))
		.filter((delta) => is_chamfer(delta))
}

// Absolute (|dx|, |dy|) sizes of every diagonal segment in a glyph (chamfers of any length).
function diagonal_sizes(character: string): Array<Delta> {
	return (WOPR_CONSOLE_GLYPHS.get(code(character)) ?? [])
		.flatMap((line) => line_deltas(line))
		.filter(([dx, dy]) => dx !== 0 && dy !== 0)
		.map(([dx, dy]) => [Math.abs(dx), Math.abs(dy)] as const)
}

// A glyph carries the reference chamfer size when at least this many of its diagonals match it.
const LEFT_SIDE_CHAMFER_COUNT = 2

describe('WOPR_CONSOLE_GLYPHS letterforms', () => {
	it("draws 'A' with a flat top (two apex vertices at cap height), not a single point", () => {
		// A horizontal top edge means at least two cap-height vertices at distinct x — not a peak.
		expect(distinct_x_at('A', GLYPH_CAP_HEIGHT)).toBeGreaterThanOrEqual(2)
	})

	it("draws 'I' and 'J' with a horizontal serif bar at the top", () => {
		// A bar (not just the stem tip) means two distinct x at that height.
		expect(distinct_x_at('I', GLYPH_CAP_HEIGHT)).toBeGreaterThanOrEqual(2)
		expect(distinct_x_at('I', 0)).toBeGreaterThanOrEqual(2)
		expect(distinct_x_at('J', GLYPH_CAP_HEIGHT)).toBeGreaterThanOrEqual(2)
	})

	it("centres J's top bar symmetrically over its stem", () => {
		const top_xs = vertices('J')
			.filter(([, y]) => y === GLYPH_CAP_HEIGHT)
			.map(([x]) => x)
		const midpoint = (Math.min(...top_xs) + Math.max(...top_xs)) / 2

		// The stem meets the bar at its midpoint -> equal overhang left and right.
		expect(top_xs).toContain(midpoint)
	})

	it("draws 'G' with a square (un-chamfered) bottom-right corner", () => {
		const points = vertices('G')
		const max_x = Math.max(...points.map(([x]) => x))

		// A square corner means the right edge (max x) reaches the baseline (y = 0).
		expect(points.some(([x, y]) => x === max_x && y === 0)).toBe(true)
	})

	it('aligns the P and R middle bar with the H crossbar (y = cap height / 2)', () => {
		const mid = GLYPH_CAP_HEIGHT / 2

		for (const character of ['P', 'R']) {
			expect(vertices(character).some(([, y]) => y === mid)).toBe(true)
		}
	})

	it("joins K's arm and leg to the stem with a short horizontal at mid-height", () => {
		// Two distinct x at mid-height (the stem and the offset junction) = the short connector.
		expect(distinct_x_at('K', GLYPH_CAP_HEIGHT / 2)).toBeGreaterThanOrEqual(2)
	})

	it("draws '.' as a small round dot at the baseline, shifted right toward the glyph centre", () => {
		const points = vertices('.')
		const xs = points.map(([x]) => x)
		const ys = points.map(([, y]) => y)
		const width = Math.max(...xs) - Math.min(...xs)
		const center_x = (Math.min(...xs) + Math.max(...xs)) / 2

		// A near-zero span the round line cap renders as a circle — not an oval capsule or boxy square.
		expect(width).toBeLessThanOrEqual(DOT_ROUND_MAX)
		// Sits at the baseline (low), matching the WOPR screen's period.
		expect(Math.max(...ys)).toBeLessThanOrEqual(DOT_BASELINE_MAX)
		// Shifted right of the old left-of-centre placement, per the WOPR screen reference.
		expect(center_x).toBeGreaterThan(DOT_MIN_CENTER_X)
	})
})

describe('WOPR_CONSOLE_GLYPHS corner chamfers', () => {
	it('cuts every A, R, P corner chamfer at 45 degrees with one equal length', () => {
		const chamfers = ['A', 'R', 'P'].flatMap((character) => chamfer_deltas(character))

		// Each glyph contributes two head/bowl chamfers -> six across A, R, P.
		expect(chamfers).toHaveLength(6)

		// 45° means the horizontal and vertical run of each chamfer are equal in magnitude.
		for (const [dx, dy] of chamfers) {
			expect(Math.abs(dx)).toBe(Math.abs(dy))
		}

		// A single shared length means every chamfer is the same size.
		const lengths = chamfers.map(([dx, dy]) => Math.hypot(dx, dy))

		expect(new Set(lengths).size).toBe(1)
	})

	it("starts R's diagonal leg right of the stem and lifts its foot off the baseline", () => {
		const lines = WOPR_CONSOLE_GLYPHS.get(code('R')) ?? []
		const leg = lines.at(-1) ?? []
		const [start_x] = leg[0] ?? [0, 0]
		const foot_y = Math.min(...leg.map(([, y]) => y))

		// The leg root is inset from the stem (x=0), not hugging it.
		expect(start_x).toBeGreaterThanOrEqual(LEG_MIN_START_X)
		// The foot sits above the baseline rather than flush at y=0.
		expect(foot_y).toBeGreaterThan(0)
	})

	it("cuts S's corner chamfers to match R's bowl (45°, same amount)", () => {
		const s_chamfers = chamfer_deltas('S')
		const [rdx, rdy] = chamfer_deltas('R')[0] ?? [0, 0]
		const r_length = Math.hypot(rdx, rdy)

		// The segment S has six corner chamfers, none of them a long diagonal.
		expect(s_chamfers).toHaveLength(6)

		for (const [dx, dy] of s_chamfers) {
			// 45° means equal horizontal and vertical run.
			expect(Math.abs(dx)).toBe(Math.abs(dy))
			// Same amount as R's bowl chamfer.
			expect(Math.hypot(dx, dy)).toBeCloseTo(r_length)
		}
	})

	it("bends G's top-right claw like S (45°, same amount)", () => {
		const g_chamfers = chamfer_deltas('G')
		const [sdx, sdy] = chamfer_deltas('S')[0] ?? [0, 0]
		const s_length = Math.hypot(sdx, sdy)

		// Only the top-right claw is a short 45° chamfer; the octagon corners use the steeper 2:3 style.
		expect(g_chamfers).toHaveLength(1)

		const [dx, dy] = g_chamfers[0] ?? [0, 0]

		expect(Math.abs(dx)).toBe(Math.abs(dy))
		expect(Math.hypot(dx, dy)).toBeCloseTo(s_length)
	})
})

describe('WOPR_CONSOLE_GLYPHS glyph widths', () => {
	it("fills R's bowl to the cell right edge so it spaces like P", () => {
		const r_max = Math.max(...vertices('R').map(([x]) => x))
		const p_max = Math.max(...vertices('P').map(([x]) => x))

		// R's rightmost ink reaches the same edge as P (was inset to 11, leaving R->A too loose).
		expect(r_max).toBe(CELL_RIGHT_EDGE)
		expect(r_max).toBe(p_max)
	})
})

describe('WOPR_CONSOLE_GLYPHS O octagon', () => {
	it('lengthens all four octagon diagonals while keeping their 2:3 slope', () => {
		const lines = WOPR_CONSOLE_GLYPHS.get(code('O')) ?? []
		const diagonals = lines
			.flatMap((line) => line_deltas(line))
			.filter(([dx, dy]) => dx !== 0 && dy !== 0)

		// A closed octagon has exactly four corner diagonals.
		expect(diagonals).toHaveLength(4)

		for (const [dx, dy] of diagonals) {
			// 2:3 slope means the vertical run is 1.5x the horizontal run.
			expect(Math.abs(dy)).toBeCloseTo(Math.abs(dx) * O_DIAGONAL_SLOPE)
			// Longer than the old ~5.4 diagonal (the 1.1-1.2x lengthening).
			expect(Math.hypot(dx, dy)).toBeGreaterThan(O_DIAGONAL_MIN_LEN)
		}
	})
})

describe('WOPR_CONSOLE_GLYPHS C/G share O and S corners', () => {
	it("gives G and C the same left-side chamfers as O's left side", () => {
		const [o_dx, o_dy] = diagonal_sizes('O')[0] ?? [0, 0]

		for (const character of ['G', 'C']) {
			const left = diagonal_sizes(character).filter(([dx, dy]) => dx === o_dx && dy === o_dy)

			// Two left-side chamfers (upper and lower) of O's exact size.
			expect(left).toHaveLength(LEFT_SIDE_CHAMFER_COUNT)
		}
	})

	it("shapes both of C's right claws like G's top-right claw", () => {
		const [gdx, gdy] = chamfer_deltas('G')[0] ?? [0, 0]
		const g_length = Math.hypot(gdx, gdy)
		const c_claws = chamfer_deltas('C')

		// C is open on the right with a top and a bottom claw; its long left chamfers are excluded.
		expect(c_claws).toHaveLength(2)

		for (const [dx, dy] of c_claws) {
			// 45° and the same amount as G's claw.
			expect(Math.abs(dx)).toBe(Math.abs(dy))
			expect(Math.hypot(dx, dy)).toBeCloseTo(g_length)
		}
	})
})
