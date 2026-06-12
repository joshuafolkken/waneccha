import { describe, expect, it } from 'vitest'
import { side_display_cycle, type SideDisplayId } from './side-display-cycle'

const INTERVAL_MS = 7000

describe('side_display_cycle', () => {
	it('exposes the four movie-inspired displays', () => {
		const expected: Array<SideDisplayId> = [
			'norad_map',
			'radar_sweep',
			'defcon_status',
			'code_countdown',
		]

		expect([...side_display_cycle.SIDE_DISPLAYS]).toEqual(expected)
		expect(side_display_cycle.display_count()).toBe(expected.length)
	})

	it('advances to the next index and wraps around', () => {
		expect(side_display_cycle.next_index(0)).toBe(1)
		expect(side_display_cycle.next_index(2)).toBe(3)
		expect(side_display_cycle.next_index(3)).toBe(0)
	})

	it('resolves a display for any index, normalizing out-of-range values', () => {
		expect(side_display_cycle.display_at(0)).toBe('norad_map')
		expect(side_display_cycle.display_at(3)).toBe('code_countdown')
		expect(side_display_cycle.display_at(4)).toBe('norad_map')
		expect(side_display_cycle.display_at(-1)).toBe('code_countdown')
	})

	it('maps elapsed time to a cycling index on the interval', () => {
		expect(side_display_cycle.index_for_elapsed(0, INTERVAL_MS)).toBe(0)
		expect(side_display_cycle.index_for_elapsed(INTERVAL_MS - 1, INTERVAL_MS)).toBe(0)
		expect(side_display_cycle.index_for_elapsed(INTERVAL_MS, INTERVAL_MS)).toBe(1)
		expect(side_display_cycle.index_for_elapsed(INTERVAL_MS * 4, INTERVAL_MS)).toBe(0)
	})

	it('guards against a non-positive interval and negative elapsed time', () => {
		expect(side_display_cycle.index_for_elapsed(5000, 0)).toBe(0)
		expect(side_display_cycle.index_for_elapsed(-5000, INTERVAL_MS)).toBe(0)
	})
})
