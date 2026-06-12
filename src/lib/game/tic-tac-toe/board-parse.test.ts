import { describe, expect, it } from 'vitest'
import { board_parse } from './board-parse'

describe('board_parse', () => {
	it('parses a valid layout into a board', () => {
		expect(board_parse.parse_board('.........')).toEqual([
			null,
			null,
			null,
			null,
			null,
			null,
			null,
			null,
			null,
		])
		expect(board_parse.parse_board('x...o....')[0]).toBe('x')
		expect(board_parse.parse_board('x...o....')[4]).toBe('o')
	})

	it('rejects a layout of the wrong length', () => {
		expect(() => board_parse.parse_board('xx')).toThrow(/length/u)
	})

	it('rejects an invalid cell character', () => {
		expect(() => board_parse.parse_board('a........')).toThrow(/cell/u)
	})
})
