import { expect, test, type Page } from '@playwright/test'

const SELF_PLAY_TIMEOUT_MS = 15_000
const DATA_CELLS = 'data-cells'
const DATA_PHASE = 'data-phase'
const DATA_PLAYER_COUNT = 'data-player-count'
const PHASE_PLAYING = 'playing'
const PHASE_SELECT = 'select'

function count_of(text: string, mark: string): number {
	let total = 0

	for (const ch of text) {
		if (ch === mark) total += 1
	}

	return total
}

async function open_select(page: Page): Promise<void> {
	await page.goto('/')
	await page.getByTestId('game-ttt').dispatchEvent('click')
}

test('selecting TIC-TAC-TOE opens the player-count screen', async ({ page }) => {
	await open_select(page)
	const board = page.getByTestId('ttt-board')

	await expect(board).toHaveAttribute(DATA_PHASE, PHASE_SELECT)
	await expect(board).toHaveAttribute(DATA_PLAYER_COUNT, '')
})

test('choosing one player starts a playable game', async ({ page }) => {
	await open_select(page)
	const board = page.getByTestId('ttt-board')

	await page.getByTestId('select-1').dispatchEvent('click')

	await expect(board).toHaveAttribute(DATA_PHASE, PHASE_PLAYING)
	await expect(board).toHaveAttribute(DATA_PLAYER_COUNT, '1')
})

test('two-player mode alternates human marks with no AI reply', async ({ page }) => {
	await open_select(page)
	const board = page.getByTestId('ttt-board')

	await page.getByTestId('select-2').dispatchEvent('click')
	await page.getByTestId('ttt-cell-0').dispatchEvent('click')

	const after_first = (await board.getAttribute(DATA_CELLS)) ?? ''

	expect(count_of(after_first, 'x')).toBe(1)
	expect(count_of(after_first, 'o')).toBe(0)

	await page.getByTestId('ttt-cell-1').dispatchEvent('click')
	const after_second = (await board.getAttribute(DATA_CELLS)) ?? ''

	expect(count_of(after_second, 'o')).toBe(1)
})

test('self-play (0 players) runs autonomously to a finished game', async ({ page }) => {
	await open_select(page)
	const board = page.getByTestId('ttt-board')

	await page.getByTestId('select-0').dispatchEvent('click')

	// The perfect AI plays both sides, so the WOPR self-match ends in a draw.
	await expect(board).toHaveAttribute('data-status', 'draw', { timeout: SELF_PLAY_TIMEOUT_MS })
})

test('back steps from a game to selection to the game list', async ({ page }) => {
	await open_select(page)
	const board = page.getByTestId('ttt-board')

	await page.getByTestId('select-1').dispatchEvent('click')
	await expect(board).toHaveAttribute(DATA_PHASE, PHASE_PLAYING)

	await page.getByTestId('ttt-back').dispatchEvent('click')
	await expect(board).toHaveAttribute(DATA_PHASE, PHASE_SELECT)

	await page.getByTestId('ttt-to-list').dispatchEvent('click')
	await expect(board).toHaveAttribute(DATA_PHASE, 'game_list')
})
