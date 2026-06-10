import { draw_helpers, TWO_PI, type DisplayDrawer, type ScreenSize } from './draw-helpers'

const LON_LINES = 12
const LAT_LINES = 6
const GRID_ALPHA = 0.35
const TARGET_BLINK_HZ = 1.5
const TARGET_RADIUS_SCALE = 0.03
const TARGET_DIM_ALPHA = 0.25
const TARGET_ON_ALPHA = 1

// Deterministic target coordinates (no Math.random — keeps renders stable).
const TARGETS: ReadonlyArray<{ x: number; y: number }> = [
	{ x: 0.22, y: 0.35 },
	{ x: 0.4, y: 0.62 },
	{ x: 0.58, y: 0.28 },
	{ x: 0.71, y: 0.55 },
	{ x: 0.85, y: 0.4 },
]

function draw_grid(ctx: CanvasRenderingContext2D, size: ScreenSize): void {
	draw_helpers.set_glow(ctx, GRID_ALPHA)
	ctx.beginPath()

	for (let index = 1; index < LON_LINES; index++) {
		const x = (size.w / LON_LINES) * index

		ctx.moveTo(x, 0)
		ctx.lineTo(x, size.h)
	}

	for (let index = 1; index < LAT_LINES; index++) {
		const y = (size.h / LAT_LINES) * index

		ctx.moveTo(0, y)
		ctx.lineTo(size.w, y)
	}

	ctx.stroke()
}

function draw_targets(ctx: CanvasRenderingContext2D, size: ScreenSize, t: number): void {
	const radius = size.h * TARGET_RADIUS_SCALE
	const is_on = Math.sin(t * TARGET_BLINK_HZ * TWO_PI) > 0

	draw_helpers.set_glow(ctx, is_on ? TARGET_ON_ALPHA : TARGET_DIM_ALPHA)

	for (const target of TARGETS) {
		ctx.beginPath()
		ctx.arc(target.x * size.w, target.y * size.h, radius, 0, TWO_PI)
		ctx.fill()
	}
}

export const draw_norad_map: DisplayDrawer = (ctx, size, t) => {
	draw_helpers.clear_screen(ctx, size)
	draw_grid(ctx, size)
	draw_targets(ctx, size, t)
	draw_helpers.draw_label(ctx, size, 'NORAD // DEFENSE GRID')
}
