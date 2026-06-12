import { describe, expect, it } from 'vitest'
import { CLICK_PLANE_MATERIAL } from './click-plane-material'

describe('CLICK_PLANE_MATERIAL', () => {
	it('is an invisible hit-area that does not write depth (regression: no black-out behind it)', () => {
		expect(CLICK_PLANE_MATERIAL.depthWrite).toBe(false)
		expect(CLICK_PLANE_MATERIAL.opacity).toBe(0)
		expect(CLICK_PLANE_MATERIAL.transparent).toBe(true)
	})
})
