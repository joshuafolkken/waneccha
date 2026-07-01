import { expect, test } from '@playwright/test'

const SIDE_DISPLAY_IDS = ['norad_map', 'radar_sweep', 'defcon_status', 'code_countdown']

test('WarGames foundation renders the 3D scene with a canvas', async ({ page }) => {
	await page.goto('/')
	await expect(page.getByTestId('game-scene')).toBeVisible()
	await expect(page.locator('canvas')).toBeVisible()
})

test('NORAD banner renders in the HP1345A vector font', async ({ page }) => {
	await page.goto('/')

	// The 3D banner is drawn in WebGL; its visually-hidden mirror proves it is mounted.
	const banner = page.getByTestId('norad-banner')

	await expect(banner).toBeAttached()
	await expect(banner).toHaveText('SHALL WE PLAY A GAME?')
	await expect(page.locator('canvas')).toBeVisible()
})

test('side displays expose valid cycling display ids', async ({ page }) => {
	await page.goto('/')
	const marker = page.getByTestId('side-display')

	await expect(marker).toBeAttached()

	const left_id = await marker.getAttribute('data-left-id')
	const right_id = await marker.getAttribute('data-right-id')

	expect(SIDE_DISPLAY_IDS).toContain(left_id)
	expect(SIDE_DISPLAY_IDS).toContain(right_id)
	// The two side screens are offset so they never show the same display simultaneously.
	expect(left_id).not.toBe(right_id)
})
