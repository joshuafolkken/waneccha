// cspell:ignore oo xx
import { describe, expect, it } from 'vitest'
import { board_parse } from './board-parse'
import type { InfiniteState, Placement } from './infinite-flow'
import { infinite_minimax } from './infinite-minimax'
import type { Mark } from './tic-tac-toe'

function state_with(layout: string, current: Mark, order: Array<Placement>): InfiniteState {
	return {
		snapshot: { board: board_parse.parse_board(layout), current, status: 'playing', winner: null },
		order,
	}
}

describe('infinite_minimax', () => {
	it('takes an immediate winning move', () => {
		const order: Array<Placement> = [
			{ index: 0, mark: 'x' },
			{ index: 1, mark: 'x' },
		]

		expect(infinite_minimax.best_move(state_with('xx.......', 'x', order))).toBe(2)
	})

	it('blocks the opponent from completing a line', () => {
		const order: Array<Placement> = [
			{ index: 0, mark: 'o' },
			{ index: 1, mark: 'o' },
			{ index: 8, mark: 'x' },
		]

		expect(infinite_minimax.best_move(state_with('oo......x', 'x', order))).toBe(2)
	})

	it('returns a legal move on an open board', () => {
		const move = infinite_minimax.best_move(state_with('.........', 'x', []))

		expect(move).toBeGreaterThanOrEqual(0)
		expect(move).toBeLessThan(9)
	})
})
