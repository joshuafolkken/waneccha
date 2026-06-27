import { describe, expect, it } from 'vitest'
import { board_parse } from './board-parse'
import { minimax } from './minimax'
import { tic_tac_toe, type Board, type Mark } from './tic-tac-toe'

const board_of = board_parse.parse_board

// Returns 0/1 when the position is terminal (1 = the AI has lost), or null when play continues.
function terminal_loss(board: Board, ai: Mark): number | null {
	const won = tic_tac_toe.winner(board)

	if (won !== null) return won === ai ? 0 : 1
	if (tic_tac_toe.is_full(board)) return 0

	return null
}

// Walk the full game tree: AI plays its optimal move, the opponent tries every move.
// Count how often the opponent ends up winning — for a perfect AI this must be zero.
function count_ai_losses(board: Board, to_move: Mark, ai: Mark): number {
	let current = board
	let mover = to_move
	let terminal = terminal_loss(current, ai)

	// Drive the AI's forced (single optimal) replies with a loop — that branch was a tail call.
	// The opponent's many replies still need branching recursion, handled after the loop.
	while (terminal === null && mover === ai) {
		current = tic_tac_toe.apply_move(current, minimax.best_move(current, ai), ai)
		mover = tic_tac_toe.other_mark(ai)
		terminal = terminal_loss(current, ai)
	}

	if (terminal !== null) return terminal

	return tic_tac_toe
		.available_moves(current)
		.reduce(
			(sum, move) =>
				sum +
				count_ai_losses(
					tic_tac_toe.apply_move(current, move, mover),
					tic_tac_toe.other_mark(mover),
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
