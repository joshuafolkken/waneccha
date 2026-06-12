// cspell:ignore xx
import { describe, expect, it } from 'vitest'
import { board_parse } from './board-parse'
import { infinite_flow, MAX_MARKS, type InfiniteState, type Placement } from './infinite-flow'
import type { Mark } from './tic-tac-toe'

function count_of(board: ReadonlyArray<unknown>, mark: Mark): number {
	return board.filter((cell) => cell === mark).length
}

function state_with(layout: string, current: Mark, order: Array<Placement>): InfiniteState {
	return {
		snapshot: { board: board_parse.parse_board(layout), current, status: 'playing', winner: null },
		order,
	}
}

describe('infinite_flow', () => {
	it('starts empty, x to move, with no placements', () => {
		const state = infinite_flow.initial_state()

		expect(state.snapshot.status).toBe('playing')
		expect(state.order).toEqual([])
	})

	it('places a mark and records it in chronological order', () => {
		const next = infinite_flow.place_at(infinite_flow.initial_state(), 4)

		expect(next.snapshot.board[4]).toBe('x')
		expect(next.snapshot.current).toBe('o')
		expect(next.order).toEqual([{ index: 4, mark: 'x' }])
	})

	it('evicts the oldest mark when a side places its fourth', () => {
		const order: Array<Placement> = [
			{ index: 0, mark: 'x' },
			{ index: 1, mark: 'x' },
			{ index: 6, mark: 'x' },
		]
		const next = infinite_flow.place_at(state_with('xx....x..', 'x', order), 8)

		expect(next.snapshot.board[0]).toBeNull()
		expect(next.snapshot.board[8]).toBe('x')
		expect(count_of(next.snapshot.board, 'x')).toBe(MAX_MARKS)
		expect(next.order).toEqual([
			{ index: 1, mark: 'x' },
			{ index: 6, mark: 'x' },
			{ index: 8, mark: 'x' },
		])
	})

	it('telegraphs the mark about to be evicted (and nothing below the cap)', () => {
		const at_cap: Array<Placement> = [
			{ index: 0, mark: 'x' },
			{ index: 1, mark: 'x' },
			{ index: 6, mark: 'x' },
		]

		expect(infinite_flow.pending_removal(state_with('xx....x..', 'x', at_cap))).toBe(0)

		const below_cap: Array<Placement> = [{ index: 0, mark: 'x' }]

		expect(infinite_flow.pending_removal(state_with('x........', 'x', below_cap))).toBe(-1)
	})

	it('detects three in a row as a win', () => {
		const order: Array<Placement> = [
			{ index: 0, mark: 'x' },
			{ index: 1, mark: 'x' },
		]
		const next = infinite_flow.place_at(state_with('xx.......', 'x', order), 2)

		expect(next.snapshot.status).toBe('won')
		expect(next.snapshot.winner).toBe('x')
	})
})
