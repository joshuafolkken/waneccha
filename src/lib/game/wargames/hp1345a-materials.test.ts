import { CustomBlending, MaxEquation, NormalBlending } from 'three'
import { describe, expect, it } from 'vitest'
import { hp1345a_materials } from './hp1345a-materials'

const DOUBLE = 2

describe('hp1345a_materials.create', () => {
	it('blends every glow layer with MAX, not additive/normal (regression: corners lit as bright dots)', () => {
		const { glow_layers } = hp1345a_materials.create()

		// MAX of overlapping same-color caps keeps one color, so glyph corners stay uniform.
		expect(glow_layers.length).toBeGreaterThan(1)

		for (const layer of glow_layers) {
			expect(layer.blending).toBe(CustomBlending)
			expect(layer.blendEquation).toBe(MaxEquation)
			expect(layer.depthWrite).toBe(false)
		}
	})

	it('keeps the bright core on normal blending in world units', () => {
		const { core } = hp1345a_materials.create()

		expect(core.blending).toBe(NormalBlending)
		expect(core.worldUnits).toBe(true)
	})
})

describe('hp1345a_materials.apply_size', () => {
	it('stacks the widest, faintest halo outside and keeps the core thinnest', () => {
		const materials = hp1345a_materials.create()

		hp1345a_materials.apply_size(materials, 1)

		const outer = materials.glow_layers.at(0)?.linewidth ?? 0
		const inner = materials.glow_layers.at(-1)?.linewidth ?? 0

		// Layer 0 is the outermost (widest) halo; layers narrow inward toward the core.
		expect(outer).toBeGreaterThan(inner)
		expect(materials.core.linewidth).toBeLessThan(inner)
	})

	it('scales every width linearly with the text size', () => {
		const materials = hp1345a_materials.create()

		hp1345a_materials.apply_size(materials, 1)
		const base = materials.glow_layers.at(0)?.linewidth ?? 0

		hp1345a_materials.apply_size(materials, DOUBLE)
		expect(materials.glow_layers.at(0)?.linewidth ?? 0).toBeCloseTo(base * DOUBLE)
	})
})
