import { infinite_flow, type InfiniteState } from './infinite-flow'
import { tic_tac_toe, type Board, type Mark } from './tic-tac-toe'

// Strong AI for Infinite Tic-Tac-Toe. The removal rule means games have no natural terminal
// (no draw, positions can recur), so a full solve is impossible — this is a depth-limited
// negamax/alpha-beta search that always takes a win and avoids a loss within the horizon, using
// an open-two-in-a-row threat count to steer the rest. Scores are from the side-to-move's view.

const WIN_SCORE = 1000
const MAX_DEPTH = 6
const NO_MOVE = -1
const INFINITY = Number.POSITIVE_INFINITY
const THREAT_MARKS = 2
const THREAT_EMPTIES = 1

interface Bounds {
	alpha: number
	beta: number
}

function is_open_threat(board: Board, line: ReadonlyArray<number>, mark: Mark): boolean {
	let mine = 0
	let empty = 0

	for (const index of line) {
		const cell = board[index] ?? null

		if (cell === mark) mine += 1
		if (cell === null) empty += 1
	}

	return mine === THREAT_MARKS && empty === THREAT_EMPTIES
}

function threats(board: Board, mark: Mark): number {
	return tic_tac_toe.WIN_LINES.filter((line) => is_open_threat(board, line, mark)).length
}

// Heuristic from the perspective of `mover` (the side to move at this node).
function heuristic(board: Board, mover: Mark): number {
	return threats(board, mover) - threats(board, tic_tac_toe.other_mark(mover))
}

function leaf_score(state: InfiniteState, depth: number): number | null {
	// A won board was decided by the previous move, so the side to move here has lost.
	if (state.snapshot.winner !== null) return depth - WIN_SCORE
	if (depth >= MAX_DEPTH) return heuristic(state.snapshot.board, state.snapshot.current)

	return null
}

function negamax(state: InfiniteState, depth: number, bounds: Bounds): number {
	const leaf = leaf_score(state, depth)

	if (leaf !== null) return leaf

	let best = -INFINITY
	let { alpha } = bounds

	for (const move of tic_tac_toe.available_moves(state.snapshot.board)) {
		const child = infinite_flow.place_at(state, move)
		const value = -negamax(child, depth + 1, { alpha: -bounds.beta, beta: -alpha })

		best = Math.max(best, value)
		alpha = Math.max(alpha, best)
		if (alpha >= bounds.beta) break
	}

	return best
}

// Best move for the side to move (state.snapshot.current).
function best_move(state: InfiniteState): number {
	let best_index = NO_MOVE
	let best_value = -INFINITY

	for (const move of tic_tac_toe.available_moves(state.snapshot.board)) {
		const child = infinite_flow.place_at(state, move)
		const value = -negamax(child, 1, { alpha: -INFINITY, beta: INFINITY })

		if (value > best_value) {
			best_value = value
			best_index = move
		}
	}

	return best_index
}

export const infinite_minimax = {
	best_move,
}
