import { expect, test, type Page } from '@playwright/test'

const EMPTY_BOARD = '.........'
const DATA_CELLS = 'data-cells'

function count_of(text: string, mark: string): number {
	let total = 0

	for (const ch of text) {
		if (ch === mark) total += 1
	}

	return total
}

async function start_one_player(page: Page): Promise<void> {
	await page.goto('/')
	await page.getByTestId('select-1').dispatchEvent('click')
}

test('one-player game starts with an empty board, human to move', async ({ page }) => {
	await start_one_player(page)
	const board = page.getByTestId('ttt-board')

	await expect(board).toHaveAttribute(DATA_CELLS, EMPTY_BOARD)
	await expect(board).toHaveAttribute('data-status', 'playing')
})

test('playing a cell places x and the AI responds with o', async ({ page }) => {
	await start_one_player(page)
	const board = page.getByTestId('ttt-board')

	await page.getByTestId('ttt-cell-4').dispatchEvent('click')
	await expect(board).not.toHaveAttribute(DATA_CELLS, EMPTY_BOARD)

	const cells = (await board.getAttribute(DATA_CELLS)) ?? ''

	expect(cells.charAt(4)).toBe('x')
	expect(count_of(cells, 'x')).toBe(1)
	expect(count_of(cells, 'o')).toBe(1)
})

test('new game resets the board', async ({ page }) => {
	await start_one_player(page)
	const board = page.getByTestId('ttt-board')

	await page.getByTestId('ttt-cell-0').dispatchEvent('click')
	await expect(board).not.toHaveAttribute(DATA_CELLS, EMPTY_BOARD)

	await page.getByTestId('ttt-reset').dispatchEvent('click')
	await expect(board).toHaveAttribute(DATA_CELLS, EMPTY_BOARD)
})
