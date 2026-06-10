import type { Board, Cell } from './tic-tac-toe'

// Parse a 9-char layout string ('x' / 'o' / '.') into a Board. Shared by the specs as a
// readable fixture builder; also handy for reconstructing a board from a serialized marker.

function to_cell(ch: string): Cell {
	if (ch === 'x') return 'x'
	if (ch === 'o') return 'o'

	return null
}

function parse_board(layout: string): Board {
	return Array.from(layout, to_cell)
}

export const board_parse = {
	parse_board,
}
