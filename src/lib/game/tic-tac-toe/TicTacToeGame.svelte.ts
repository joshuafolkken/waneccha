import { game_flow, type GameSnapshot, type GameStatus } from './game-flow'
import { minimax } from './minimax'
import type { Board, Mark } from './tic-tac-toe'

const EMPTY_CELL = '.'
const NO_MOVE = -1
const HUMAN_MARK: Mark = 'x'
const AI_MARK: Mark = 'o'

// Reactive tic-tac-toe store. Human (x) vs the perfect AI (o); the AI replies synchronously
// after each human move. Player-count modes (self-play / two-player) arrive in a later issue.
interface TicTacToeGame {
	readonly board: Board
	readonly status: GameStatus
	readonly winner: Mark | null
	readonly current: Mark
	readonly serialized: string
	play: (index: number) => void
	reset: () => void
}

function create_tic_tac_toe_game(): TicTacToeGame {
	let snapshot = $state<GameSnapshot>(game_flow.initial_snapshot())

	function ai_step(): void {
		if (snapshot.status !== 'playing' || snapshot.current !== AI_MARK) return

		const move = minimax.best_move(snapshot.board, AI_MARK)

		if (move !== NO_MOVE) snapshot = game_flow.play_at(snapshot, move)
	}

	function play(index: number): void {
		if (snapshot.current !== HUMAN_MARK) return

		const before = snapshot

		snapshot = game_flow.play_at(snapshot, index)

		if (snapshot !== before) ai_step()
	}

	function reset(): void {
		snapshot = game_flow.initial_snapshot()
	}

	return {
		get board(): Board {
			return snapshot.board
		},
		get status(): GameStatus {
			return snapshot.status
		},
		get winner(): Mark | null {
			return snapshot.winner
		},
		get current(): Mark {
			return snapshot.current
		},
		get serialized(): string {
			return snapshot.board.map((cell) => cell ?? EMPTY_CELL).join('')
		},
		play,
		reset,
	}
}

const tic_tac_toe_game = create_tic_tac_toe_game()

export { tic_tac_toe_game }
