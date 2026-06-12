import { expect, test } from '@playwright/test'

test('home page renders the game scene', async ({ page }) => {
	await page.goto('/')
	await expect(page.getByTestId('game-scene')).toBeVisible()
})
