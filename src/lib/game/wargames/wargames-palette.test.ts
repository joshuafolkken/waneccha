import { describe, expect, it } from 'vitest'
import { hex_channels } from './hex-color'
import {
	ROOM_CEILING_COLOR,
	ROOM_FLOOR_COLOR,
	ROOM_WALL_COLOR,
	SCENE_BG_COLOR,
	SCREEN_CANVAS_BG_COLOR,
	SCREEN_DIM_COLOR,
	SCREEN_GLOW_COLOR,
} from './wargames-config'

// Every surface, screen, and operation-screen canvas shares one cyan hue family (issue #29).
const PALETTE = [
	SCREEN_GLOW_COLOR,
	SCREEN_DIM_COLOR,
	SCREEN_CANVAS_BG_COLOR,
	ROOM_FLOOR_COLOR,
	ROOM_WALL_COLOR,
	ROOM_CEILING_COLOR,
	SCENE_BG_COLOR,
]

describe('WarGames palette', () => {
	it('glows in the movie cyan, not phosphor green (regression: #29)', () => {
		const { red, green, blue } = hex_channels(SCREEN_GLOW_COLOR)

		// Light cyan: blue is the strongest channel and green outshines red. The old green
		// glow (#33ff66) had green as the dominant channel, so it would fail both checks.
		expect(blue).toBeGreaterThanOrEqual(green)
		expect(green).toBeGreaterThan(red)
	})

	it('unifies every surface and screen color into the same cyan family (#29)', () => {
		for (const color of PALETTE) {
			const { green, blue } = hex_channels(color)

			// Blue-leaning across the whole palette — never green-dominant as before.
			expect(blue).toBeGreaterThanOrEqual(green)
		}
	})
})
