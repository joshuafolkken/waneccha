import { Color } from 'three'
import { describe, expect, it } from 'vitest'
import { SCREEN_GLOW_COLOR, TERMINAL_TEXT_COLOR } from './wargames-config'

// Red may reach at most this share of blue for the banner to read as blue, not a pale near-white. The
// old #8fb2ff had red at ~0.56x blue (too washed out) and fails this; a saturated blue stays under it.
const BANNER_RED_CEILING = 0.5

describe('wargames-config palette', () => {
	it('paints the NORAD banner text a saturated blue, not a pale near-white', () => {
		const { r, g, b } = new Color(TERMINAL_TEXT_COLOR)

		// Blue dominates and red is well below it, so the stroke reads clearly blue rather than white.
		expect(b).toBeGreaterThan(g)
		expect(r).toBeLessThan(b * BANNER_RED_CEILING)
	})

	it('keeps the shared screen glow neutral white, not a tinted cyan', () => {
		const { r, g, b } = new Color(SCREEN_GLOW_COLOR)

		// Equal channels = achromatic white; the earlier cyan #33ccff had green/blue above red and fails.
		expect(r).toBe(g)
		expect(g).toBe(b)
	})
})
