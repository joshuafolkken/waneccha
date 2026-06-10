import { describe, expect, it } from 'vitest'
import { game_list_reveal } from './game-list-reveal'

const TOTAL = 5

describe('game_list_reveal', () => {
	it('reveals one more line at a time, capped at the total', () => {
		expect(game_list_reveal.next(1, TOTAL)).toBe(2)
		expect(game_list_reveal.next(4, TOTAL)).toBe(5)
		expect(game_list_reveal.next(5, TOTAL)).toBe(5)
	})

	it('reports completion once every line is revealed', () => {
		expect(game_list_reveal.is_complete(4, TOTAL)).toBe(false)
		expect(game_list_reveal.is_complete(5, TOTAL)).toBe(true)
		expect(game_list_reveal.is_complete(6, TOTAL)).toBe(true)
	})
})
