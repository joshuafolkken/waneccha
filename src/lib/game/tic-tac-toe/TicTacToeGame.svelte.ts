import { game_flow, type GameSnapshot, type GameStatus } from './game-flow'
import { game_mode, type PlayerCount } from './game-mode'
import { minimax } from './minimax'
import type { Board, Mark } from './tic-tac-toe'

const EMPTY_CELL = '.'
const NO_MOVE = -1
// Pace between self-play moves. Kept well under the self-play E2E budget
// (player-select.e2e.ts) so 9 moves finish comfortably within its timeout.
const SELF_PLAY_DELAY_MS = 350

export type GamePhase = 'select' | 'playing'

// Reactive match controller. `player_count === null` is the WarGames "HOW MANY PLAYERS"
// selection screen. 1 = human (x) vs perfect AI (o), 2 = two humans, 0 = AI self-play (the
// WOPR auto-match), stepped on a timer so the moves are watchable.
let snapshot = $state<GameSnapshot>(game_flow.initial_snapshot())
let player_count = $state<PlayerCount | null>(null)
let self_play_timer: ReturnType<typeof setTimeout> | null = null

function is_ai_turn(): boolean {
	return player_count !== null && game_mode.is_ai_mark(player_count, snapshot.current)
}

function clear_timer(): void {
	if (self_play_timer === null) return

	clearTimeout(self_play_timer)
	self_play_timer = null
}

function ai_step(): void {
	if (snapshot.status !== 'playing' || !is_ai_turn()) return

	const move = minimax.best_move(snapshot.board, snapshot.current)

	if (move !== NO_MOVE) snapshot = game_flow.play_at(snapshot, move)
}

function schedule_self_play(): void {
	clear_timer()

	if (player_count === null || !game_mode.is_self_play(player_count)) return
	if (snapshot.status !== 'playing') return

	self_play_timer = setTimeout(() => {
		ai_step()
		schedule_self_play()
	}, SELF_PLAY_DELAY_MS)
}

function start(count: PlayerCount): void {
	clear_timer()
	player_count = count
	snapshot = game_flow.initial_snapshot()
	schedule_self_play()
}

function play(index: number): void {
	if (player_count === null || is_ai_turn()) return

	const before = snapshot

	snapshot = game_flow.play_at(snapshot, index)

	if (snapshot !== before && is_ai_turn()) ai_step()
}

function reset(): void {
	clear_timer()
	snapshot = game_flow.initial_snapshot()
	schedule_self_play()
}

function to_select(): void {
	clear_timer()
	player_count = null
	snapshot = game_flow.initial_snapshot()
}

// Cancel any pending self-play timer without otherwise changing state — for component teardown.
function stop(): void {
	clear_timer()
}

export const tic_tac_toe_game = {
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
	get phase(): GamePhase {
		return player_count === null ? 'select' : 'playing'
	},
	get player_count(): PlayerCount | null {
		return player_count
	},
	start,
	play,
	ai_step,
	reset,
	to_select,
	stop,
}
