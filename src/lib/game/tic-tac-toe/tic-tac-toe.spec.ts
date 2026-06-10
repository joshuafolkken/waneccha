// cspell:ignore xoxoxoox xoxxoxoxo xoxxoxox
import { describe, expect, it } from 'vitest'
import { board_parse } from './board-parse'
import { tic_tac_toe } from './tic-tac-toe'

const board_of = board_parse.parse_board

describe('tic_tac_toe', () => {
	it('starts with nine empty cells', () => {
		const board = tic_tac_toe.empty_board()

		expect(board).toHaveLength(9)
		expect(board.every((cell) => cell === null)).toBe(true)
	})

	it('generates eight win lines (3 rows, 3 cols, 2 diagonals)', () => {
		expect(tic_tac_toe.WIN_LINES).toHaveLength(8)
	})

	it('detects a winner on every row', () => {
		expect(tic_tac_toe.winner(board_of('xxx......'))).toBe('x')
		expect(tic_tac_toe.winner(board_of('...ooo...'))).toBe('o')
		expect(tic_tac_toe.winner(board_of('......xxx'))).toBe('x')
	})

	it('detects a winner on every column and diagonal', () => {
		expect(tic_tac_toe.winner(board_of('o..o..o..'))).toBe('o')
		expect(tic_tac_toe.winner(board_of('..x..x..x'))).toBe('x')
		expect(tic_tac_toe.winner(board_of('x...x...x'))).toBe('x')
		expect(tic_tac_toe.winner(board_of('..o.o.o..'))).toBe('o')
	})

	it('returns null when there is no winner', () => {
		expect(tic_tac_toe.winner(board_of('.........'))).toBeNull()
		expect(tic_tac_toe.winner(board_of('xoxoxoox.'))).toBeNull()
	})

	it('lists available moves and detects a full board', () => {
		expect(tic_tac_toe.available_moves(board_of('xx.......'))).toEqual([2, 3, 4, 5, 6, 7, 8])
		expect(tic_tac_toe.is_full(board_of('xoxxoxoxo'))).toBe(true)
		expect(tic_tac_toe.is_full(board_of('xoxxoxox.'))).toBe(false)
	})

	it('applies a move without mutating the source board', () => {
		const board = tic_tac_toe.empty_board()
		const next = tic_tac_toe.apply_move(board, 4, 'x')

		expect(next[4]).toBe('x')
		expect(board[4]).toBeNull()
	})

	it('toggles the active mark', () => {
		expect(tic_tac_toe.other_mark('x')).toBe('o')
		expect(tic_tac_toe.other_mark('o')).toBe('x')
	})
})
