import { CELL_COUNT, type Board, type Cell } from './tic-tac-toe'

// Parse a CELL_COUNT-char layout string ('x' / 'o' / '.') into a Board. Validates length and
// charset strictly so a malformed fixture or corrupted serialized marker fails at parse-time
// rather than silently producing a wrong board.

const EMPTY_CELL = '.'

function to_cell(ch: string): Cell {
	if (ch === 'x') return 'x'
	if (ch === 'o') return 'o'
	if (ch === EMPTY_CELL) return null

	throw new Error(`Invalid board cell: ${ch}`)
}

function parse_board(layout: string): Board {
	if (layout.length !== CELL_COUNT) {
		throw new Error(
			`Invalid board length: expected ${String(CELL_COUNT)}, got ${String(layout.length)}`,
		)
	}

	return Array.from(layout, to_cell)
}

export const board_parse = {
	parse_board,
}
