import type { GameStatus } from './game-flow'
import type { Mark } from './tic-tac-toe'

// Maps the game outcome to a stable status key. The Svelte layer resolves the key to a
// localized, movie-styled string; keeping the mapping pure makes it node-testable.

export type StatusKey = 'your_move' | 'wopr_wins' | 'you_win' | 'draw'

function status_key(status: GameStatus, winner: Mark | null): StatusKey {
	if (status === 'draw') return 'draw'

	if (status === 'won') {
		if (winner === null) throw new Error('winner must be set when status is "won"')

		return winner === 'o' ? 'wopr_wins' : 'you_win'
	}

	return 'your_move'
}

export const status_message = {
	status_key,
}
