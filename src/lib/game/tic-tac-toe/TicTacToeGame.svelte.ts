import { game_flow, type GameSnapshot, type GameStatus } from './game-flow'
import { game_mode, type PlayerCount } from './game-mode'
import { infinite_flow, type InfiniteState, type Placement } from './infinite-flow'
import { infinite_minimax } from './infinite-minimax'
import { minimax } from './minimax'
import type { Board, Mark } from './tic-tac-toe'

const EMPTY_CELL = '.'
const NO_MOVE = -1
// Pace between self-play moves. Kept well under the self-play E2E budget
// (player-select.e2e.ts) so 9 moves finish comfortably within its timeout.
const SELF_PLAY_DELAY_MS = 350

export type GamePhase = 'game_list' | 'select' | 'playing'
export type Variant = 'classic' | 'infinite'

// Reactive match controller. Screens: 'game_list' (the WOPR roster) → 'select' (HOW MANY
// PLAYERS) → 'playing'. 1 = human (x) vs perfect AI (o), 2 = two humans, 0 = AI self-play.
// The 'infinite' variant caps each side at 3 marks (oldest is evicted) and uses a depth-limited AI.
let snapshot = $state<GameSnapshot>(game_flow.initial_snapshot())
let order = $state<ReadonlyArray<Placement>>([])
let player_count = $state<PlayerCount | null>(null)
let screen = $state<GamePhase>('game_list')
let variant = $state<Variant>('classic')
let self_play_timer: ReturnType<typeof setTimeout> | null = null

function infinite_state(): InfiniteState {
	return { snapshot, order }
}

function is_ai_turn(): boolean {
	return player_count !== null && game_mode.is_ai_mark(player_count, snapshot.current)
}

function apply_move(index: number): void {
	if (variant === 'infinite') {
		const next = infinite_flow.place_at(infinite_state(), index)

		snapshot = next.snapshot
		order = next.order
	} else {
		snapshot = game_flow.play_at(snapshot, index)
	}
}

function ai_best_move(): number {
	return variant === 'infinite'
		? infinite_minimax.best_move(infinite_state())
		: minimax.best_move(snapshot.board, snapshot.current)
}

function clear_timer(): void {
	if (self_play_timer === null) return

	clearTimeout(self_play_timer)
	self_play_timer = null
}

function ai_step(): void {
	if (snapshot.status !== 'playing' || !is_ai_turn()) return

	const move = ai_best_move()

	if (move !== NO_MOVE) apply_move(move)
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

function reset_board(): void {
	snapshot = game_flow.initial_snapshot()
	order = []
}

// Reset to a fresh board on the given screen, cancelling any running self-play.
function go_to(target: GamePhase, count: PlayerCount | null): void {
	clear_timer()
	screen = target
	player_count = count
	reset_board()
}

function open_select(): void {
	go_to('select', null)
}

function to_game_list(): void {
	go_to('game_list', null)
}

function to_select(): void {
	go_to('select', null)
}

function start(count: PlayerCount): void {
	go_to('playing', count)
	schedule_self_play()
}

function play(index: number): void {
	if (screen !== 'playing' || is_ai_turn()) return

	const before = snapshot

	apply_move(index)

	if (snapshot !== before && is_ai_turn()) ai_step()
}

function reset(): void {
	clear_timer()
	reset_board()
	schedule_self_play()
}

function set_variant(next: Variant): void {
	variant = next
	reset()
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
		return screen
	},
	get player_count(): PlayerCount | null {
		return player_count
	},
	get variant(): Variant {
		return variant
	},
	get pending_removal(): number {
		return variant === 'infinite' ? infinite_flow.pending_removal(infinite_state()) : NO_MOVE
	},
	open_select,
	to_game_list,
	to_select,
	start,
	play,
	ai_step,
	reset,
	set_variant,
	stop,
}
