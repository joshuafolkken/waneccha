// Fat-line materials for the HP1345A vector text (see ./Hp1345aText.svelte). The look is a crisp cyan
// display character with a slight light bleed — built from line geometry, not scene-wide bloom: the
// cyan core stroke plus a few tight concentric halo layers.
//
// Each halo layer uses MAX blending (CustomBlending + MaxEquation), NOT additive or normal alpha
// blending. Adjacent fat-line segments meet with rounded caps at every glyph corner; translucent
// alpha blending brightened those overlapping caps into white dots at each bend. MAX takes the
// per-channel maximum, so overlapping same-color halo keeps one color and corners stay uniform.
//
// The halo layers stay dimmer than the core and hug it tightly, so the result reads as a slight
// overflow of light rather than a neon tube, with no bright highlight in the stroke.
import { Color, CustomBlending, MaxEquation, NormalBlending, OneFactor } from 'three'
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js'
import { SCREEN_GLOW_COLOR } from './wargames-config'

// The cyan glow ramp the halo layers interpolate across — both stay dimmer than the core stroke.
const GLOW_DIM_COLOR = '#0a2f3a'
const GLOW_BRIGHT_COLOR = '#1d7d99'

// Halo geometry as fractions of cap height: the outermost layer is OUTER_GLOW_FRACTION wide and each
// inner layer is GLOW_WIDTH_RATIO of the previous one. Widths are scaled to the text size at runtime.
const GLOW_LAYER_COUNT = 3
const OUTER_GLOW_FRACTION = 0.1
const GLOW_WIDTH_RATIO = 0.5
const CORE_WIDTH_FRACTION = 0.022
const RAMP_SPAN = GLOW_LAYER_COUNT - 1

export interface Hp1345aMaterials {
	core: LineMaterial
	glow_layers: Array<LineMaterial>
}

function glow_layer_fraction(index: number): number {
	return OUTER_GLOW_FRACTION * GLOW_WIDTH_RATIO ** index
}

function glow_layer_color(index: number): Color {
	// index 0 is the outermost (dimmest) layer, the last index sits just outside the core (brightest).
	return new Color(GLOW_DIM_COLOR).lerp(new Color(GLOW_BRIGHT_COLOR), index / RAMP_SPAN)
}

function create_glow_layer(index: number): LineMaterial {
	return new LineMaterial({
		worldUnits: true,
		transparent: true,
		depthWrite: false,
		blending: CustomBlending,
		blendEquation: MaxEquation,
		blendSrc: OneFactor,
		blendDst: OneFactor,
		color: glow_layer_color(index),
	})
}

function create_materials(): Hp1345aMaterials {
	const core = new LineMaterial({
		worldUnits: true,
		transparent: true,
		blending: NormalBlending,
		color: SCREEN_GLOW_COLOR,
	})
	const glow_layers = Array.from({ length: GLOW_LAYER_COUNT }, (_, index) =>
		create_glow_layer(index),
	)

	return { core, glow_layers }
}

// Scale every line width to the text size (world units); called reactively as `size` changes.
function apply_size(materials: Hp1345aMaterials, size: number): void {
	materials.core.linewidth = size * CORE_WIDTH_FRACTION

	for (const [index, layer] of materials.glow_layers.entries()) {
		layer.linewidth = size * glow_layer_fraction(index)
	}
}

export const hp1345a_materials = {
	create: create_materials,
	apply_size,
}
