import type { GameSnapshot } from './game-flow'
import { tic_tac_toe, type Board, type Mark } from './tic-tac-toe'

// Infinite Tic-Tac-Toe: each side keeps at most MAX_MARKS marks on the board. Placing a side's
// (MAX_MARKS + 1)th mark removes its oldest mark. The board never fills, so games never draw —
// they continue until someone makes three in a row. `order` tracks live placements chronologically.

export const MAX_MARKS = 3
const NONE = -1

export interface Placement {
	index: number
	mark: Mark
}

export interface InfiniteState {
	snapshot: GameSnapshot
	order: ReadonlyArray<Placement>
}

function initial_state(first: Mark = 'x'): InfiniteState {
	return {
		snapshot: { board: tic_tac_toe.empty_board(), current: first, status: 'playing', winner: null },
		order: [],
	}
}

function mark_count(order: ReadonlyArray<Placement>, mark: Mark): number {
	return order.filter((placement) => placement.mark === mark).length
}

function oldest_index(order: ReadonlyArray<Placement>, mark: Mark): number {
	const oldest = order.find((placement) => placement.mark === mark)

	return oldest ? oldest.index : NONE
}

function without_oldest(order: ReadonlyArray<Placement>, mark: Mark): Array<Placement> {
	const position = order.findIndex((placement) => placement.mark === mark)

	if (position === NONE) return [...order]

	return [...order.slice(0, position), ...order.slice(position + 1)]
}

function clear_cell(board: Board, index: number): Board {
	return board.map((cell, position) => (position === index ? null : cell))
}

// The mark that will be evicted on the current player's next placement, or null. The UI renders
// it translucent to telegraph the removal.
function pending_removal(state: InfiniteState): number {
	const { snapshot, order } = state

	if (snapshot.status !== 'playing') return NONE
	if (mark_count(order, snapshot.current) < MAX_MARKS) return NONE

	return oldest_index(order, snapshot.current)
}

function is_playable(state: InfiniteState, index: number): boolean {
	return state.snapshot.status === 'playing' && state.snapshot.board[index] === null
}

function place_at(state: InfiniteState, index: number): InfiniteState {
	if (!is_playable(state, index)) return state

	const mark = state.snapshot.current
	const is_at_cap = mark_count(state.order, mark) >= MAX_MARKS
	const evicted = is_at_cap ? oldest_index(state.order, mark) : NONE
	const cleared =
		evicted === NONE ? state.snapshot.board : clear_cell(state.snapshot.board, evicted)
	const board = tic_tac_toe.apply_move(cleared, index, mark)
	const trimmed = is_at_cap ? without_oldest(state.order, mark) : [...state.order]
	const won = tic_tac_toe.winner(board)

	return {
		snapshot: {
			board,
			// On a win the game is over; `current` is left as the next-to-move (the loser) so the
			// AI search can treat a won node uniformly from the side-to-move's perspective.
			current: tic_tac_toe.other_mark(mark),
			status: won === null ? 'playing' : 'won',
			winner: won,
		},
		order: [...trimmed, { index, mark }],
	}
}

export const infinite_flow = {
	initial_state,
	is_playable,
	place_at,
	pending_removal,
}
