import { ROOM_D, ROOM_H, ROOM_W } from '@joshuafolkken/game-kit'
import { describe, expect, it } from 'vitest'
import {
	BANNER_BLOCK_H,
	BANNER_POS,
	CENTER_H,
	CENTER_POS,
	TERMINAL_H,
	TERMINAL_POS,
	TERMINAL_W,
} from './scene-layout'

const HALF = 2

describe('WarGames NORAD banner placement', () => {
	const [, banner_y] = BANNER_POS
	const [, center_y] = CENTER_POS
	// Guard against the whole multi-line banner block, not just a single line.
	const banner_half = BANNER_BLOCK_H / HALF
	const screen_top = center_y + CENTER_H / HALF

	it('floats above the center screen with a gap (regression: banner overlapped the display)', () => {
		expect(banner_y - banner_half).toBeGreaterThan(screen_top)
	})

	it('stays below the room ceiling', () => {
		expect(banner_y + banner_half).toBeLessThan(ROOM_H)
	})
})

describe('WarGames terminal placement', () => {
	const [terminal_x, terminal_y, terminal_z] = TERMINAL_POS

	it('fits within the room height and footprint', () => {
		expect(terminal_y - TERMINAL_H / HALF).toBeGreaterThan(0)
		expect(terminal_y + TERMINAL_H / HALF).toBeLessThan(ROOM_H)
		// the panel's width spans X here (front-facing); keep its centre and span inside the walls.
		expect(Math.abs(terminal_x) + TERMINAL_W / HALF).toBeLessThan(ROOM_W / HALF)
		expect(Math.abs(terminal_z)).toBeLessThan(ROOM_D / HALF)
	})
})
