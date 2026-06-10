import type { Mark } from './tic-tac-toe'

// Player-count modes (WarGames "HOW MANY PLAYERS"): 0 = WOPR self-play (both marks AI),
// 1 = human (x) vs AI (o), 2 = two human players. Pure config so it is node-testable.

export type PlayerCount = 0 | 1 | 2

export interface ModeConfig {
	ai_marks: ReadonlyArray<Mark>
	human_marks: ReadonlyArray<Mark>
}

const SELF_PLAY: PlayerCount = 0
const ONE_PLAYER: PlayerCount = 1
const TWO_PLAYER: PlayerCount = 2

// Selectable player counts in display order (1P, 2P, then the WOPR self-play option).
export const ALL_PLAYER_COUNTS: ReadonlyArray<PlayerCount> = [ONE_PLAYER, TWO_PLAYER, SELF_PLAY]

function config_for(count: PlayerCount): ModeConfig {
	if (count === SELF_PLAY) return { ai_marks: ['x', 'o'], human_marks: [] }
	if (count === ONE_PLAYER) return { ai_marks: ['o'], human_marks: ['x'] }

	return { ai_marks: [], human_marks: ['x', 'o'] }
}

function is_ai_mark(count: PlayerCount, mark: Mark): boolean {
	return config_for(count).ai_marks.includes(mark)
}

function is_self_play(count: PlayerCount): boolean {
	return config_for(count).human_marks.length === 0
}

export const game_mode = {
	config_for,
	is_ai_mark,
	is_self_play,
}
