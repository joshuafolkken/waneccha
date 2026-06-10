import { tic_tac_toe, type Board, type Mark } from './tic-tac-toe'

// Pure snapshot reducer for a tic-tac-toe game. The runes store wraps this; keeping the
// transition logic framework-free makes it node-testable without a Svelte runtime.

export type GameStatus = 'playing' | 'won' | 'draw'

export interface GameSnapshot {
	board: Board
	current: Mark
	status: GameStatus
	winner: Mark | null
}

function initial_snapshot(first: Mark = 'x'): GameSnapshot {
	return {
		board: tic_tac_toe.empty_board(),
		current: first,
		status: 'playing',
		winner: null,
	}
}

function is_playable(snapshot: GameSnapshot, index: number): boolean {
	return snapshot.status === 'playing' && snapshot.board[index] === null
}

function play_at(snapshot: GameSnapshot, index: number): GameSnapshot {
	if (!is_playable(snapshot, index)) return snapshot

	const board = tic_tac_toe.apply_move(snapshot.board, index, snapshot.current)
	const won = tic_tac_toe.winner(board)

	if (won !== null) return { board, current: snapshot.current, status: 'won', winner: won }

	if (tic_tac_toe.is_full(board)) {
		return { board, current: snapshot.current, status: 'draw', winner: null }
	}

	return {
		board,
		current: tic_tac_toe.other_mark(snapshot.current),
		status: 'playing',
		winner: null,
	}
}

export const game_flow = {
	initial_snapshot,
	is_playable,
	play_at,
}
