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

// The blue glow ramp the halo layers interpolate across — both stay dimmer than the core stroke.
// Blue (not cyan) so the text reads as the WarGames console's blue, glow included. The dim end is
// PURE BLACK so the widest halo MAX-blends to a no-op over ANY dark background (MAX(bg, 0) = bg):
// the glow emerges from the background with no visible outer ring, on every screen regardless of its
// exact background color. A near-black (non-zero) dim end would sit just above the screen color and
// leave a faint edge where the halo ends — pure black removes it entirely.
const GLOW_DIM_COLOR = '#000000'
const GLOW_BRIGHT_COLOR = '#4d6ed8'

// Halo geometry as fractions of cap height. Many thin layers spaced LINEARLY from the widest outer
// halo to the narrowest inner one — with the color ramp below and MAX blending, the stack reads as a
// smooth gradient glow rather than a few visible bands. Widths are scaled to the text size at runtime.
const GLOW_LAYER_COUNT = 14
const OUTER_GLOW_FRACTION = 0.19
const INNER_GLOW_FRACTION = 0.05
const CORE_WIDTH_FRACTION = 0.038
const RAMP_SPAN = GLOW_LAYER_COUNT - 1

export interface Hp1345aMaterials {
	core: LineMaterial
	glow_layers: Array<LineMaterial>
}

function glow_layer_fraction(index: number): number {
	// Linear interpolation: index 0 is the widest (outer) halo, the last index the narrowest (inner).
	const ratio = index / RAMP_SPAN

	return OUTER_GLOW_FRACTION + ratio * (INNER_GLOW_FRACTION - OUTER_GLOW_FRACTION)
}

// The halo's radial brightness follows a CONVEX curve (a sharp peak at the core with a long faint
// tail) rather than a straight line. A linear color ramp reads as a solid "mound" of light — a raised
// plateau around the stroke — instead of a soft glow. The exponent (>1) biases brightness toward the
// inner (core-side) layers so most of the radius is faint and only the innermost layers are bright.
const GLOW_RAMP_EXPONENT = 4

function glow_ramp_t(index: number): number {
	// index 0 = outermost/dimmest (t -> 0); the last index = innermost/brightest (t -> 1).
	return (index / RAMP_SPAN) ** GLOW_RAMP_EXPONENT
}

function glow_layer_color(index: number): Color {
	// index 0 is the outermost (dimmest) layer, the last index sits just outside the core (brightest).
	return new Color(GLOW_DIM_COLOR).lerp(new Color(GLOW_BRIGHT_COLOR), glow_ramp_t(index))
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

// Scale every line width to the text size (world units); called reactively as `size` changes. The
// optional `weight` multiplies the core AND glow widths together, so the stroke reads heavier while
// the core stays inside its halo.
function apply_size(materials: Hp1345aMaterials, size: number, weight = 1): void {
	materials.core.linewidth = size * CORE_WIDTH_FRACTION * weight

	for (const [index, layer] of materials.glow_layers.entries()) {
		layer.linewidth = size * glow_layer_fraction(index) * weight
	}
}

export const hp1345a_materials = {
	create: create_materials,
	apply_size,
}
