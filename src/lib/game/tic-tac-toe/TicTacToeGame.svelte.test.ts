import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { tic_tac_toe_game } from './TicTacToeGame.svelte'

const EMPTY = '.........'
const CENTER = 4
const MAX_MOVES = 9

function count_of(text: string, mark: string): number {
	let total = 0

	for (const ch of text) {
		if (ch === mark) total += 1
	}

	return total
}

function reset_to_game_list(): void {
	tic_tac_toe_game.to_game_list()
}

describe('tic_tac_toe_game navigation', () => {
	beforeEach(reset_to_game_list)
	afterEach(reset_to_game_list)

	it('starts on the WOPR game-list screen with an empty board', () => {
		expect(tic_tac_toe_game.phase).toBe('game_list')
		expect(tic_tac_toe_game.player_count).toBeNull()
		expect(tic_tac_toe_game.serialized).toBe(EMPTY)
	})

	it('opens the player-count selection from the game list', () => {
		tic_tac_toe_game.open_select()

		expect(tic_tac_toe_game.phase).toBe('select')
	})

	it('ignores plays before a game has started', () => {
		tic_tac_toe_game.open_select()
		tic_tac_toe_game.play(CENTER)

		expect(tic_tac_toe_game.serialized).toBe(EMPTY)
	})

	it('returns from a game to selection, and from selection to the game list', () => {
		tic_tac_toe_game.start(1)
		tic_tac_toe_game.to_select()
		expect(tic_tac_toe_game.phase).toBe('select')

		tic_tac_toe_game.to_game_list()
		expect(tic_tac_toe_game.phase).toBe('game_list')
		expect(tic_tac_toe_game.serialized).toBe(EMPTY)
	})
})

describe('tic_tac_toe_game play modes', () => {
	beforeEach(reset_to_game_list)
	afterEach(reset_to_game_list)

	it('one player: human x plays and the AI replies with a single o', () => {
		tic_tac_toe_game.start(1)
		expect(tic_tac_toe_game.phase).toBe('playing')

		tic_tac_toe_game.play(CENTER)
		const { serialized } = tic_tac_toe_game

		expect(serialized.charAt(CENTER)).toBe('x')
		expect(count_of(serialized, 'x')).toBe(1)
		expect(count_of(serialized, 'o')).toBe(1)
		expect(tic_tac_toe_game.current).toBe('x')
	})

	it('two players: no AI reply — turns alternate between humans', () => {
		tic_tac_toe_game.start(2)

		tic_tac_toe_game.play(0)
		expect(count_of(tic_tac_toe_game.serialized, 'o')).toBe(0)
		expect(tic_tac_toe_game.current).toBe('o')

		tic_tac_toe_game.play(1)
		expect(tic_tac_toe_game.current).toBe('x')
	})

	it('self-play (0): stepping both AI marks reaches a drawn game', () => {
		tic_tac_toe_game.start(0)

		let guard = 0

		while (tic_tac_toe_game.status === 'playing' && guard < MAX_MOVES) {
			tic_tac_toe_game.ai_step()
			guard += 1
		}

		expect(tic_tac_toe_game.status).toBe('draw')
	})
})
