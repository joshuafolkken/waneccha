import { describe, expect, it } from 'vitest'
import { ROOM_CEILING_COLOR, ROOM_FLOOR_COLOR, ROOM_WALL_COLOR } from './wargames-config'

const HEX_RADIX = 16
const MAX_CHANNEL = 255
const RED_START = 0
const GREEN_START = 2
const BLUE_START = 4
const CHANNEL_WIDTH = 2

// Rec. 709 luma weights — perceived brightness of each channel.
const RED_WEIGHT = 0.2126
const GREEN_WEIGHT = 0.7152
const BLUE_WEIGHT = 0.0722

// Lower bound: both the original near-black surfaces (#05070a ≈ 0.027) and the first
// brightening attempt (#161a21 ≈ 0.10, still judged invisible) fall below this, so a
// regression to "too dark to see" fails. Upper bound keeps the room dim, not lit.
const MIN_DIM_LUMINANCE = 0.12
const MAX_DIM_LUMINANCE = 0.4

function relative_luminance(hex: string): number {
	const body = hex.replace('#', '')
	const red = Number.parseInt(body.slice(RED_START, RED_START + CHANNEL_WIDTH), HEX_RADIX)
	const green = Number.parseInt(body.slice(GREEN_START, GREEN_START + CHANNEL_WIDTH), HEX_RADIX)
	const blue = Number.parseInt(body.slice(BLUE_START, BLUE_START + CHANNEL_WIDTH), HEX_RADIX)

	return (RED_WEIGHT * red + GREEN_WEIGHT * green + BLUE_WEIGHT * blue) / MAX_CHANNEL
}

describe('WarGames room surface colors', () => {
	it('renders the room dimly visible, not pitch black (regression: #27)', () => {
		const surfaces = [ROOM_FLOOR_COLOR, ROOM_WALL_COLOR, ROOM_CEILING_COLOR]

		for (const color of surfaces) {
			expect(relative_luminance(color)).toBeGreaterThan(MIN_DIM_LUMINANCE)
			expect(relative_luminance(color)).toBeLessThan(MAX_DIM_LUMINANCE)
		}
	})
})
