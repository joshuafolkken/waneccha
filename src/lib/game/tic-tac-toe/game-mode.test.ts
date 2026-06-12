import { describe, expect, it } from 'vitest'
import { game_mode } from './game-mode'

describe('game_mode', () => {
	it('makes both marks AI for self-play (0 players)', () => {
		const config = game_mode.config_for(0)

		expect(config.ai_marks).toEqual(['x', 'o'])
		expect(config.human_marks).toEqual([])
	})

	it('makes x human and o AI for one player', () => {
		const config = game_mode.config_for(1)

		expect(config.human_marks).toEqual(['x'])
		expect(config.ai_marks).toEqual(['o'])
	})

	it('makes both marks human for two players', () => {
		const config = game_mode.config_for(2)

		expect(config.human_marks).toEqual(['x', 'o'])
		expect(config.ai_marks).toEqual([])
	})

	it('reports which marks are AI-controlled per mode', () => {
		expect(game_mode.is_ai_mark(0, 'x')).toBe(true)
		expect(game_mode.is_ai_mark(1, 'x')).toBe(false)
		expect(game_mode.is_ai_mark(1, 'o')).toBe(true)
		expect(game_mode.is_ai_mark(2, 'o')).toBe(false)
	})

	it('treats only the 0-player mode as self-play', () => {
		expect(game_mode.is_self_play(0)).toBe(true)
		expect(game_mode.is_self_play(1)).toBe(false)
		expect(game_mode.is_self_play(2)).toBe(false)
	})
})
