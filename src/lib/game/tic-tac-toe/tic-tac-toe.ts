// Framework-free tic-tac-toe primitives. The board is a flat array of CELL_COUNT cells,
// row-major. Win lines are generated from BOARD_DIM so the rules generalize to any N×N.

export type Mark = 'x' | 'o'
export type Cell = Mark | null
export type Board = Array<Cell>

export const BOARD_DIM = 3
export const CELL_COUNT = BOARD_DIM * BOARD_DIM

// 0..8 cell indices, shared by the 3D board meshes and the accessible fallback buttons.
export const CELL_INDICES = Array.from({ length: CELL_COUNT }, (_, index) => index)

const LAST_IN_DIM = BOARD_DIM - 1

function build_win_lines(): ReadonlyArray<ReadonlyArray<number>> {
	const lines: Array<Array<number>> = []
	const main_diag: Array<number> = []
	const anti_diag: Array<number> = []

	for (let axis = 0; axis < BOARD_DIM; axis++) {
		const row: Array<number> = []
		const col: Array<number> = []

		for (let offset = 0; offset < BOARD_DIM; offset++) {
			row.push(axis * BOARD_DIM + offset)
			col.push(offset * BOARD_DIM + axis)
		}

		lines.push(row, col)
		main_diag.push(axis * BOARD_DIM + axis)
		anti_diag.push(axis * BOARD_DIM + (LAST_IN_DIM - axis))
	}

	lines.push(main_diag, anti_diag)

	return lines
}

const WIN_LINES = build_win_lines()

function empty_board(): Board {
	return Array.from({ length: CELL_COUNT }, () => null)
}

function other_mark(mark: Mark): Mark {
	return mark === 'x' ? 'o' : 'x'
}

function apply_move(board: Board, index: number, mark: Mark): Board {
	return board.map((cell, position) => (position === index ? mark : cell))
}

function available_moves(board: Board): Array<number> {
	const moves: Array<number> = []

	for (const [index, cell] of board.entries()) {
		if (cell === null) moves.push(index)
	}

	return moves
}

function is_full(board: Board): boolean {
	return board.every((cell) => cell !== null)
}

function line_winner(board: Board, line: ReadonlyArray<number>): Cell {
	let mark: Cell = null

	for (const index of line) {
		const cell = board[index] ?? null

		if (cell === null) return null
		if (mark === null) mark = cell
		else if (cell !== mark) return null
	}

	return mark
}

function winner(board: Board): Cell {
	for (const line of WIN_LINES) {
		const found = line_winner(board, line)

		if (found !== null) return found
	}

	return null
}

export const tic_tac_toe = {
	WIN_LINES,
	empty_board,
	other_mark,
	apply_move,
	available_moves,
	is_full,
	winner,
}
