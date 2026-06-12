import { describe, expect, it } from 'vitest'
import { board_layout, CELL_SIZE } from './board-layout'

describe('board_layout', () => {
	it('places the center cell at the origin', () => {
		expect(board_layout.cell_position(4)).toEqual([0, 0])
	})

	it('places cell 0 at the top-left and cell 8 at the bottom-right', () => {
		const [x0, y0] = board_layout.cell_position(0)
		const [x8, y8] = board_layout.cell_position(8)

		expect(x0).toBeCloseTo(-CELL_SIZE)
		expect(y0).toBeCloseTo(CELL_SIZE)
		expect(x8).toBeCloseTo(CELL_SIZE)
		expect(y8).toBeCloseTo(-CELL_SIZE)
	})

	it('keeps the top row above the bottom row', () => {
		const [, top_y] = board_layout.cell_position(1)
		const [, bottom_y] = board_layout.cell_position(7)

		expect(top_y).toBeGreaterThan(bottom_y)
	})
})
