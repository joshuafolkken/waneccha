import { expect, test, type Page } from '@playwright/test'

const DATA_VARIANT = 'data-variant'
const DATA_CELLS = 'data-cells'
const DATA_PENDING = 'data-pending'
const GAME_TTT = 'game-ttt'
const VARIANT_INFINITE = 'variant-infinite'

function count_of(text: string, mark: string): number {
	let total = 0

	for (const ch of text) {
		if (ch === mark) total += 1
	}

	return total
}

async function tap(page: Page, testid: string): Promise<void> {
	await page.getByTestId(testid).dispatchEvent('click')
}

async function tap_cell(page: Page, index: number): Promise<void> {
	await tap(page, `ttt-cell-${String(index)}`)
}

async function start_infinite_two_player(page: Page): Promise<void> {
	await page.goto('/')
	await tap(page, GAME_TTT)
	await tap(page, VARIANT_INFINITE)
	await tap(page, 'select-2')
}

// x:0 o:3 x:1 o:4 x:6 o:7 — leaves x holding three marks (0,1,6) with x to move.
async function fill_x_to_cap(page: Page): Promise<void> {
	await tap_cell(page, 0)
	await tap_cell(page, 3)
	await tap_cell(page, 1)
	await tap_cell(page, 4)
	await tap_cell(page, 6)
	await tap_cell(page, 7)
}

test('the game starts in classic mode and can switch to infinite', async ({ page }) => {
	await page.goto('/')
	await tap(page, GAME_TTT)
	const board = page.getByTestId('ttt-board')

	await expect(board).toHaveAttribute(DATA_VARIANT, 'classic')

	await tap(page, VARIANT_INFINITE)
	await expect(board).toHaveAttribute(DATA_VARIANT, 'infinite')
})

test('infinite mode telegraphs then evicts a side’s oldest mark on its fourth move', async ({
	page,
}) => {
	await start_infinite_two_player(page)
	const board = page.getByTestId('ttt-board')

	await fill_x_to_cap(page)
	// The oldest x mark (cell 0) is telegraphed as pending removal.
	await expect(board).toHaveAttribute(DATA_PENDING, '0')

	await tap_cell(page, 8)
	const cells = (await board.getAttribute(DATA_CELLS)) ?? ''

	expect(cells.charAt(0)).toBe('.')
	expect(cells.charAt(8)).toBe('x')
	expect(count_of(cells, 'x')).toBe(3)
})
