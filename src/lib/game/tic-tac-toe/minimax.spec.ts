import { describe, expect, it } from 'vitest'
import { board_parse } from './board-parse'
import { minimax } from './minimax'
import { tic_tac_toe, type Board, type Mark } from './tic-tac-toe'

const board_of = board_parse.parse_board

// Walk the full game tree: AI plays its optimal move, the opponent tries every move.
// Count how often the opponent ends up winning — for a perfect AI this must be zero.
function count_ai_losses(board: Board, to_move: Mark, ai: Mark): number {
	const won = tic_tac_toe.winner(board)

	if (won !== null) return won === ai ? 0 : 1
	if (tic_tac_toe.is_full(board)) return 0

	if (to_move === ai) {
		const move = minimax.best_move(board, ai)

		return count_ai_losses(tic_tac_toe.apply_move(board, move, ai), tic_tac_toe.other_mark(ai), ai)
	}

	return tic_tac_toe
		.available_moves(board)
		.reduce(
			(sum, move) =>
				sum +
				count_ai_losses(
					tic_tac_toe.apply_move(board, move, to_move),
					tic_tac_toe.other_mark(to_move),
					ai,
				),
			0,
		)
}

describe('minimax', () => {
	it('takes an immediate winning move', () => {
		// x at 0 and 1; completing the top row at index 2 wins.
		expect(minimax.best_move(board_of('xx.......'), 'x')).toBe(2)
	})

	it('blocks the opponent from winning', () => {
		// o threatens the top row at 0,1; x must block at index 2.
		expect(minimax.best_move(board_of('oo......x'), 'x')).toBe(2)
	})

	it('never loses as the second player (o)', () => {
		expect(count_ai_losses(tic_tac_toe.empty_board(), 'x', 'o')).toBe(0)
	})

	it('never loses as the first player (x)', () => {
		expect(count_ai_losses(tic_tac_toe.empty_board(), 'x', 'x')).toBe(0)
	})
})
