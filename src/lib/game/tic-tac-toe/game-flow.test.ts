// cspell:ignore xoxxo
import { describe, expect, it } from 'vitest'
import { board_parse } from './board-parse'
import { game_flow, type GameSnapshot } from './game-flow'
import { tic_tac_toe, type Mark } from './tic-tac-toe'

const board_of = board_parse.parse_board

function snapshot_of(layout: string, current: Mark): GameSnapshot {
	return { board: board_of(layout), current, status: 'playing', winner: null }
}

describe('game_flow', () => {
	it('starts playing with an empty board and x to move', () => {
		const snapshot = game_flow.initial_snapshot()

		expect(snapshot.status).toBe('playing')
		expect(snapshot.current).toBe('x')
		expect(tic_tac_toe.is_full(snapshot.board)).toBe(false)
	})

	it('places the current mark and passes the turn', () => {
		const next = game_flow.play_at(game_flow.initial_snapshot(), 4)

		expect(next.board[4]).toBe('x')
		expect(next.current).toBe('o')
		expect(next.status).toBe('playing')
	})

	it('marks the game won when a move completes a line', () => {
		const next = game_flow.play_at(snapshot_of('xx.......', 'x'), 2)

		expect(next.status).toBe('won')
		expect(next.winner).toBe('x')
	})

	it('marks a draw when the final cell fills with no winner', () => {
		const next = game_flow.play_at(snapshot_of('xoxxo.oxo', 'x'), 5)

		expect(next.status).toBe('draw')
		expect(next.winner).toBeNull()
	})

	it('ignores moves on occupied cells or finished games', () => {
		const occupied = snapshot_of('x........', 'o')

		expect(game_flow.play_at(occupied, 0)).toBe(occupied)
		expect(game_flow.is_playable(occupied, 0)).toBe(false)
	})
})
