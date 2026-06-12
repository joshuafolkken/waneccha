import { expect, test } from '@playwright/test'

const DATA_PHASE = 'data-phase'

test('the WOPR game list is shown by default', async ({ page }) => {
	await page.goto('/')

	await expect(page.getByTestId('ttt-board')).toHaveAttribute(DATA_PHASE, 'game_list')
})

test('selecting TIC-TAC-TOE from the list advances to player selection', async ({ page }) => {
	await page.goto('/')
	const board = page.getByTestId('ttt-board')

	await expect(board).toHaveAttribute(DATA_PHASE, 'game_list')
	await page.getByTestId('game-ttt').dispatchEvent('click')

	await expect(board).toHaveAttribute(DATA_PHASE, 'select')
})
