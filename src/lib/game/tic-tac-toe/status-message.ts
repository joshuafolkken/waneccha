import type { GameStatus } from './game-flow'
import type { PlayerCount } from './game-mode'
import type { Mark } from './tic-tac-toe'

// Maps the game outcome to a stable status key. The win wording depends on the mode: one-player
// frames it as the human vs WOPR ("YOU WIN" / "WOPR WINS"); two-player and self-play use neutral
// "X WINS" / "O WINS". The Svelte layer resolves keys to localized, movie-styled strings.

export type StatusKey = 'your_move' | 'wopr_wins' | 'you_win' | 'x_wins' | 'o_wins' | 'draw'

const ONE_PLAYER: PlayerCount = 1

function win_key(winner: Mark, player_count: PlayerCount | null): StatusKey {
	if (player_count === ONE_PLAYER) return winner === 'o' ? 'wopr_wins' : 'you_win'

	return winner === 'x' ? 'x_wins' : 'o_wins'
}

function status_key(
	status: GameStatus,
	winner: Mark | null,
	player_count: PlayerCount | null,
): StatusKey {
	if (status === 'draw') return 'draw'

	if (status === 'won') {
		if (winner === null) throw new Error('winner must be set when status is "won"')

		return win_key(winner, player_count)
	}

	return 'your_move'
}

export const status_message = {
	status_key,
}
