import { describe, expect, it } from 'vitest'
import { wopr_tones } from './wopr-tones'

describe('wopr_tones', () => {
	it('plays an ascending pair on a win', () => {
		const [first, second] = wopr_tones.status_tones('won')

		expect(first).toBeDefined()
		expect(second).toBeDefined()
		expect(second?.frequency ?? 0).toBeGreaterThan(first?.frequency ?? 0)
	})

	it('plays a low tone on a draw', () => {
		const [first] = wopr_tones.status_tones('draw')

		expect(first?.type).toBe('sawtooth')
	})

	it('plays nothing while the game is still in progress', () => {
		expect(wopr_tones.status_tones('playing')).toEqual([])
	})

	it('exposes distinct place and select beeps', () => {
		expect(wopr_tones.PLACE_TONE.frequency).not.toBe(wopr_tones.SELECT_TONE.frequency)
	})
})
