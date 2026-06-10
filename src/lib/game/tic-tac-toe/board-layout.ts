import { BOARD_DIM } from './tic-tac-toe'

// Local-space geometry for the 3x3 board drawn on the center screen. Cell 0 is top-left,
// cell 8 bottom-right; the grid is centered on the origin of the board group.

const AXIS_DIVISOR = 2

export const BOARD_EXTENT = 1.35
export const CELL_SIZE = BOARD_EXTENT / BOARD_DIM
const CENTER_OFFSET = (BOARD_DIM - 1) / AXIS_DIVISOR

function cell_position(index: number): [number, number] {
	const row = Math.floor(index / BOARD_DIM)
	const col = index % BOARD_DIM
	const x = (col - CENTER_OFFSET) * CELL_SIZE
	const y = (CENTER_OFFSET - row) * CELL_SIZE

	return [x, y]
}

export const board_layout = {
	cell_position,
}
