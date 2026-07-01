import { describe, expect, it } from 'vitest'
import { hex_channels } from './hex-color'
import {
	ROOM_CEILING_COLOR,
	ROOM_FLOOR_COLOR,
	ROOM_WALL_COLOR,
	SCENE_BG_COLOR,
	SCREEN_CANVAS_BG_COLOR,
	SCREEN_DIM_COLOR,
} from './wargames-config'

// The room surfaces and screen backgrounds share one dark cyan hue family (issue #29). The bright
// glow accent (SCREEN_GLOW_COLOR) is intentionally neutral white now — asserted in wargames-config.
const PALETTE = [
	SCREEN_DIM_COLOR,
	SCREEN_CANVAS_BG_COLOR,
	ROOM_FLOOR_COLOR,
	ROOM_WALL_COLOR,
	ROOM_CEILING_COLOR,
	SCENE_BG_COLOR,
]

describe('WarGames palette', () => {
	it('unifies every surface and screen background into the same cyan family (#29)', () => {
		for (const color of PALETTE) {
			const { green, blue } = hex_channels(color)

			// Blue-leaning across the whole palette — never green-dominant as the old phosphor green was.
			expect(blue).toBeGreaterThanOrEqual(green)
		}
	})
})
