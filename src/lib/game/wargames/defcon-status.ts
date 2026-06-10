import { draw_helpers, HALF, TWO_PI, type DisplayDrawer } from './draw-helpers'
import { SCREEN_GLOW_COLOR } from './wargames-config'

const LEVEL_COUNT = 5
const BAR_ALPHA = 0.25
const ACTIVE_ON_ALPHA = 1
const ACTIVE_OFF_ALPHA = 0.45
const ACTIVE_BLINK_HZ = 1
// DEFCON escalates over time for atmosphere: cycles 5 → 1.
const ESCALATE_PERIOD_S = 20
const BAR_HEIGHT_SCALE = 0.11
const BAR_GAP_SCALE = 0.5
const BAR_TOP_BIAS_SCALE = 0.06
const BAR_LEFT_SCALE = 0.18
const BAR_WIDTH_SCALE = 0.64

interface BarRect {
	x: number
	y: number
	w: number
	h: number
}

function active_level(t: number): number {
	const step = Math.floor((t % ESCALATE_PERIOD_S) / (ESCALATE_PERIOD_S / LEVEL_COUNT))

	return LEVEL_COUNT - step
}

function bar_alpha(is_active: boolean, t: number): number {
	if (!is_active) return BAR_ALPHA

	const is_blink_on = Math.sin(t * ACTIVE_BLINK_HZ * TWO_PI) > 0

	return is_blink_on ? ACTIVE_ON_ALPHA : ACTIVE_OFF_ALPHA
}

function draw_bar(ctx: CanvasRenderingContext2D, rect: BarRect, alpha: number): void {
	ctx.globalAlpha = alpha
	ctx.fillStyle = SCREEN_GLOW_COLOR
	ctx.fillRect(rect.x, rect.y, rect.w, rect.h)
}

export const draw_defcon_status: DisplayDrawer = (ctx, size, t) => {
	draw_helpers.clear_screen(ctx, size)

	const current = active_level(t)
	const bar_h = size.h * BAR_HEIGHT_SCALE
	const gap = bar_h * BAR_GAP_SCALE
	const total = LEVEL_COUNT * bar_h + (LEVEL_COUNT - 1) * gap
	const top = (size.h - total) * HALF + size.h * BAR_TOP_BIAS_SCALE
	const x = size.w * BAR_LEFT_SCALE
	const bar_w = size.w * BAR_WIDTH_SCALE

	for (let index = 0; index < LEVEL_COUNT; index++) {
		const level = index + 1
		const y = top + index * (bar_h + gap)

		draw_bar(ctx, { x, y, w: bar_w, h: bar_h }, bar_alpha(level === current, t))
	}

	draw_helpers.draw_label(ctx, size, `DEFCON ${String(current)}`)
}
