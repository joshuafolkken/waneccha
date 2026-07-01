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
