import { describe, expect, it } from 'vitest'
import { side_display_cycle } from './side-display-cycle'
import { side_displays } from './side-displays'

describe('side_displays registry', () => {
	it('provides a drawer function for every cycled display id', () => {
		for (const id of side_display_cycle.SIDE_DISPLAYS) {
			expect(side_displays.has(id)).toBe(true)
			expect(typeof side_displays.drawer_for(id)).toBe('function')
		}
	})

	it('rejects unknown display ids', () => {
		expect(side_displays.has('unknown')).toBe(false)
	})
})
