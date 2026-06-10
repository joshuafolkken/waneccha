import { beforeEach, describe, expect, it } from 'vitest'
import { tic_tac_toe_game } from './TicTacToeGame.svelte'

const EMPTY = '.........'
const CENTER = 4

function count_of(text: string, mark: string): number {
	let total = 0

	for (const ch of text) {
		if (ch === mark) total += 1
	}

	return total
}

describe('tic_tac_toe_game store', () => {
	beforeEach(() => {
		tic_tac_toe_game.reset()
	})

	it('starts empty with the human (x) to move', () => {
		expect(tic_tac_toe_game.serialized).toBe(EMPTY)
		expect(tic_tac_toe_game.current).toBe('x')
		expect(tic_tac_toe_game.status).toBe('playing')
	})

	it('places x and the AI replies with a single o, returning the turn to the human', () => {
		tic_tac_toe_game.play(CENTER)
		const { serialized } = tic_tac_toe_game

		expect(serialized.charAt(CENTER)).toBe('x')
		expect(count_of(serialized, 'x')).toBe(1)
		expect(count_of(serialized, 'o')).toBe(1)
		expect(tic_tac_toe_game.current).toBe('x')
	})

	it('ignores a play on an occupied cell', () => {
		tic_tac_toe_game.play(0)
		const after_first = tic_tac_toe_game.serialized

		tic_tac_toe_game.play(0)

		expect(tic_tac_toe_game.serialized).toBe(after_first)
	})

	it('resets the board to empty', () => {
		tic_tac_toe_game.play(0)
		tic_tac_toe_game.reset()

		expect(tic_tac_toe_game.serialized).toBe(EMPTY)
	})
})
