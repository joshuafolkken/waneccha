import { CustomBlending, MaxEquation, NormalBlending } from 'three'
import type { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js'
import { describe, expect, it } from 'vitest'
import { hp1345a_materials } from './hp1345a-materials'

// Peak channel (perceived brightness) of the glow layer at `index`, 0 when the layer is missing.
function luminance_at(layers: Array<LineMaterial>, index: number): number {
	const color = layers.at(index)?.color

	return color ? Math.max(color.r, color.g, color.b) : 0
}

const DOUBLE = 2
// The widest halo must be at least this multiple of the core width — a genuine bloom, not a tight rim.
const MIN_HALO_MULTIPLE = 3
// Max per-channel byte the widest halo may reach so MAX-blending it over the dark screen is a no-op
// and leaves no outer ring (0..255). Pure black (0) passes; a non-zero dim end like #0a1226 (blue
// 0x26 = 38) sits above the screen color and would show an edge, so it must fail this.
const GLOW_BLEND_CEILING = 16
const HEX_RADIX = 16
const CHANNEL_STARTS = [0, 2, 4]
const CHANNEL_LEN = 2

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

	it('fades the widest halo into a near-black screen background (regression: hard glow edge)', () => {
		const { glow_layers } = hp1345a_materials.create()
		// Layer 0 is the outermost (dimmest) halo — it is what meets the screen background.
		const hex = glow_layers.at(0)?.color.getHexString() ?? 'ffffff'
		const max_channel = Math.max(
			...CHANNEL_STARTS.map((start) =>
				Number.parseInt(hex.slice(start, start + CHANNEL_LEN), HEX_RADIX),
			),
		)

		expect(max_channel).toBeLessThan(GLOW_BLEND_CEILING)
	})

	it('eases glow brightness toward the core so the halo falls off convexly (regression: light mound)', () => {
		const { glow_layers } = hp1345a_materials.create()

		const outer = luminance_at(glow_layers, 0)
		const inner = luminance_at(glow_layers, -1)
		const middle = luminance_at(glow_layers, Math.floor(glow_layers.length / DOUBLE))

		// A linear ramp would put the middle layer at the midpoint; the convex ease biases it dimmer.
		expect(middle).toBeLessThan((outer + inner) / DOUBLE)
	})

	it('keeps the bright core on normal blending in world units', () => {
		const { core } = hp1345a_materials.create()

		expect(core.blending).toBe(NormalBlending)
		expect(core.worldUnits).toBe(true)
	})
})

describe('hp1345a_materials.apply_size', () => {
	it('stacks the widest, faintest halo outside and keeps a glow rim around the core', () => {
		const materials = hp1345a_materials.create()

		hp1345a_materials.apply_size(materials, 1)

		const outer = materials.glow_layers.at(0)?.linewidth ?? 0
		const inner = materials.glow_layers.at(-1)?.linewidth ?? 0

		// Layer 0 is the outermost (widest) halo; layers narrow inward.
		expect(outer).toBeGreaterThan(inner)
		// The bright core sits inside the outermost halo, so a glow rim still surrounds it.
		expect(materials.core.linewidth).toBeLessThan(outer)
	})

	it('scales every width linearly with the text size', () => {
		const materials = hp1345a_materials.create()

		hp1345a_materials.apply_size(materials, 1)
		const base = materials.glow_layers.at(0)?.linewidth ?? 0

		hp1345a_materials.apply_size(materials, DOUBLE)
		expect(materials.glow_layers.at(0)?.linewidth ?? 0).toBeCloseTo(base * DOUBLE)
	})

	it('spreads a wide luminous halo well beyond the core', () => {
		const materials = hp1345a_materials.create()

		hp1345a_materials.apply_size(materials, 1)
		const outer = materials.glow_layers.at(0)?.linewidth ?? 0

		// The outer halo is several times the core width — a real bloom, not a tight hug.
		expect(outer).toBeGreaterThan(materials.core.linewidth * MIN_HALO_MULTIPLE)
	})
})
