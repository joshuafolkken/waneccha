import { describe, expect, it } from 'vitest'
import { hex_channels } from './hex-color'
import { AMBIENT_INTENSITY, POINT_INTENSITY } from './scene-layout'
import { LIGHT_COLOR } from './wargames-config'

// The room is lit only by these two (neutral-white) lights, so if they drop too low the
// dim surfaces read as a black void. These floors guard against regressing to "can't see
// the room" (see issue #27). They are minimums, not exact pins — brighter is allowed.
const MIN_VISIBLE_AMBIENT = 0.5
const MIN_VISIBLE_POINT = 1.4

describe('WarGames scene lighting', () => {
	it('keeps the room lit enough to be visible, not a black void (regression: #27)', () => {
		expect(AMBIENT_INTENSITY).toBeGreaterThanOrEqual(MIN_VISIBLE_AMBIENT)
		expect(POINT_INTENSITY).toBeGreaterThanOrEqual(MIN_VISIBLE_POINT)
	})

	it('lights the room with a neutral white (no tint) color', () => {
		const { red, green, blue } = hex_channels(LIGHT_COLOR)

		expect(red).toBe(green)
		expect(green).toBe(blue)
	})
})
