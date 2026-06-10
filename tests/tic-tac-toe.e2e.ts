import { expect, test } from '@playwright/test'

const EMPTY_BOARD = '.........'
const DATA_CELLS = 'data-cells'

function count_of(text: string, mark: string): number {
	let total = 0

	for (const ch of text) {
		if (ch === mark) total += 1
	}

	return total
}

test('the board renders empty and waiting for the human move', async ({ page }) => {
	await page.goto('/')
	const board = page.getByTestId('ttt-board')

	await expect(board).toHaveAttribute(DATA_CELLS, EMPTY_BOARD)
	await expect(board).toHaveAttribute('data-status', 'playing')
})

test('playing a cell places x and the AI responds with o', async ({ page }) => {
	await page.goto('/')
	const board = page.getByTestId('ttt-board')

	await page.getByTestId('ttt-cell-4').dispatchEvent('click')
	await expect(board).not.toHaveAttribute(DATA_CELLS, EMPTY_BOARD)

	const cells = (await board.getAttribute(DATA_CELLS)) ?? ''

	expect(cells.charAt(4)).toBe('x')
	expect(count_of(cells, 'x')).toBe(1)
	// The perfect AI replies synchronously, so exactly one o appears after a single human move.
	expect(count_of(cells, 'o')).toBe(1)
})

test('new game resets the board', async ({ page }) => {
	await page.goto('/')
	const board = page.getByTestId('ttt-board')

	await page.getByTestId('ttt-cell-0').dispatchEvent('click')
	await expect(board).not.toHaveAttribute(DATA_CELLS, EMPTY_BOARD)

	await page.getByTestId('ttt-reset').dispatchEvent('click')
	await expect(board).toHaveAttribute(DATA_CELLS, EMPTY_BOARD)
})
