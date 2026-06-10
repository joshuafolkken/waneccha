import { tic_tac_toe, type Board, type Mark } from './tic-tac-toe'

// Perfect (optimal) tic-tac-toe AI. Minimax with depth-discounted scores so the AI prefers
// the fastest win and the slowest loss. Against optimal play it never loses.

const WIN_SCORE = 10
const INFINITY = Number.POSITIVE_INFINITY
const NO_MOVE = -1
const FIRST_DEPTH = 1
const NEXT_DEPTH = 1

function terminal_score(board: Board, mark: Mark, depth: number): number | null {
	const won = tic_tac_toe.winner(board)

	if (won === mark) return WIN_SCORE - depth
	if (won === tic_tac_toe.other_mark(mark)) return depth - WIN_SCORE
	if (tic_tac_toe.is_full(board)) return 0

	return null
}

function minimax_value(board: Board, mark: Mark, to_move: Mark, depth: number): number {
	const terminal = terminal_score(board, mark, depth)

	if (terminal !== null) return terminal

	const is_maximizing = to_move === mark
	let best = is_maximizing ? -INFINITY : INFINITY

	for (const move of tic_tac_toe.available_moves(board)) {
		const next = tic_tac_toe.apply_move(board, move, to_move)
		const value = minimax_value(next, mark, tic_tac_toe.other_mark(to_move), depth + NEXT_DEPTH)

		best = is_maximizing ? Math.max(best, value) : Math.min(best, value)
	}

	return best
}

function best_move(board: Board, mark: Mark): number {
	let best_index = NO_MOVE
	let best_value = -INFINITY

	for (const move of tic_tac_toe.available_moves(board)) {
		const next = tic_tac_toe.apply_move(board, move, mark)
		const value = minimax_value(next, mark, tic_tac_toe.other_mark(mark), FIRST_DEPTH)

		if (value > best_value) {
			best_value = value
			best_index = move
		}
	}

	return best_index
}

export const minimax = {
	best_move,
}
