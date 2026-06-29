import { ROOM_H } from '@joshuafolkken/game-kit'
import { describe, expect, it } from 'vitest'
import { BANNER_POS, BANNER_SIZE, CENTER_H, CENTER_POS } from './scene-layout'

const HALF = 2

describe('WarGames NORAD banner placement', () => {
	const [, banner_y] = BANNER_POS
	const [, center_y] = CENTER_POS
	const banner_half = BANNER_SIZE / HALF
	const screen_top = center_y + CENTER_H / HALF

	it('floats above the center screen with a gap (regression: banner overlapped the display)', () => {
		expect(banner_y - banner_half).toBeGreaterThan(screen_top)
	})

	it('stays below the room ceiling', () => {
		expect(banner_y + banner_half).toBeLessThan(ROOM_H)
	})
})
