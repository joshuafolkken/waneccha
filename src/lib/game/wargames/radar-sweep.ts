import { draw_helpers, HALF, TWO_PI, type DisplayDrawer, type ScreenSize } from './draw-helpers'

const RING_COUNT = 4
const RING_ALPHA = 0.3
const SWEEP_HZ = 0.25
const SWEEP_ALPHA = 0.8
const BLIP_ALPHA = 0.9
const BLIP_RADIUS_SCALE = 0.025
const RADAR_RADIUS_SCALE = 0.42

const BLIPS: ReadonlyArray<{ angle: number; dist: number }> = [
	{ angle: 0.7, dist: 0.55 },
	{ angle: 2.4, dist: 0.8 },
	{ angle: 4.1, dist: 0.4 },
]

interface RadarFrame {
	cx: number
	cy: number
	r: number
}

function center_of(size: ScreenSize): RadarFrame {
	return {
		cx: size.w * HALF,
		cy: size.h * HALF,
		r: Math.min(size.w, size.h) * RADAR_RADIUS_SCALE,
	}
}

function draw_rings(ctx: CanvasRenderingContext2D, frame: RadarFrame): void {
	draw_helpers.set_glow(ctx, RING_ALPHA)
	ctx.beginPath()

	for (let index = 1; index <= RING_COUNT; index++) {
		const ring_r = (frame.r / RING_COUNT) * index

		ctx.moveTo(frame.cx + ring_r, frame.cy)
		ctx.arc(frame.cx, frame.cy, ring_r, 0, TWO_PI)
	}

	ctx.stroke()
}

function draw_sweep(ctx: CanvasRenderingContext2D, frame: RadarFrame, t: number): void {
	const angle = (t * SWEEP_HZ * TWO_PI) % TWO_PI

	draw_helpers.set_glow(ctx, SWEEP_ALPHA)
	ctx.beginPath()
	ctx.moveTo(frame.cx, frame.cy)
	ctx.lineTo(frame.cx + Math.cos(angle) * frame.r, frame.cy + Math.sin(angle) * frame.r)
	ctx.stroke()
}

function draw_blips(ctx: CanvasRenderingContext2D, size: ScreenSize, frame: RadarFrame): void {
	const blip_r = size.h * BLIP_RADIUS_SCALE

	draw_helpers.set_glow(ctx, BLIP_ALPHA)

	for (const blip of BLIPS) {
		const x = frame.cx + Math.cos(blip.angle) * frame.r * blip.dist
		const y = frame.cy + Math.sin(blip.angle) * frame.r * blip.dist

		ctx.beginPath()
		ctx.arc(x, y, blip_r, 0, TWO_PI)
		ctx.fill()
	}
}

export const draw_radar_sweep: DisplayDrawer = (ctx, size, t) => {
	const frame = center_of(size)

	draw_helpers.clear_screen(ctx, size)
	draw_rings(ctx, frame)
	draw_sweep(ctx, frame, t)
	draw_blips(ctx, size, frame)
	draw_helpers.draw_label(ctx, size, 'EARLY WARNING RADAR')
}
