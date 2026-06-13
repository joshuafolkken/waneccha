import { describe, expect, it } from 'vitest'
import { AMBIENT_INTENSITY, POINT_INTENSITY } from './scene-layout'

// The room is lit only by these two (cyan-tinted) lights, so if they drop too low the
// dim surfaces read as a black void. These floors guard against regressing to "can't see
// the room" (see issue #27). They are minimums, not exact pins — brighter is allowed.
const MIN_VISIBLE_AMBIENT = 0.5
const MIN_VISIBLE_POINT = 1.4

describe('WarGames scene lighting', () => {
	it('keeps the room lit enough to be visible, not a black void (regression: #27)', () => {
		expect(AMBIENT_INTENSITY).toBeGreaterThanOrEqual(MIN_VISIBLE_AMBIENT)
		expect(POINT_INTENSITY).toBeGreaterThanOrEqual(MIN_VISIBLE_POINT)
	})
})
