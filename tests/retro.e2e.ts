import { expect, test } from '@playwright/test'

test('the CRT/RETRO post-process is off by default', async ({ page }) => {
	await page.goto('/')
	const scene = page.getByTestId('game-scene')

	await expect(scene).toBeVisible()
	// The game-kit container only carries `crt-active` while the CRT post-process is enabled.
	await expect(scene).not.toHaveClass(/crt-active/u)
})
