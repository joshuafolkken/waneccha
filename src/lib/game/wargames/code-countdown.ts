import { draw_helpers, type DisplayDrawer, type ScreenSize } from './draw-helpers'

const CODE_DIGITS = 10
const CODE_ROWS = 3
const DIGIT_BASE = 10
const SCRAMBLE_HZ = 8
const COUNTDOWN_START_S = 600
const SECONDS_PER_MINUTE = 60
const DIGIT_FONT_SCALE = 0.13
const TIMER_FONT_SCALE = 0.22
const CODE_ROW_TOP = 0.32
const CODE_ROW_STEP = 0.13
const CODE_LEFT = 0.08
const TIMER_X = 0.28
const TIMER_Y = 0.78
const CODE_ALPHA = 0.85
const FULL_ALPHA = 1
const PAD_LENGTH = 2

// Deterministic per-cell digit that churns with time — evokes a launch-code search.
function scramble_digit(row: number, col: number, tick: number): number {
	const seed = row * CODE_DIGITS + col + tick

	return Math.abs(Math.floor(Math.sin(seed) * DIGIT_BASE)) % DIGIT_BASE
}

function row_text(row: number, tick: number): string {
	const chars = Array.from({ length: CODE_DIGITS }, (_, col) => scramble_digit(row, col, tick))

	return chars.join(' ')
}

function draw_code_rows(ctx: CanvasRenderingContext2D, size: ScreenSize, t: number): void {
	const tick = Math.floor(t * SCRAMBLE_HZ)
	const font_size = size.h * DIGIT_FONT_SCALE

	draw_helpers.set_text(ctx, font_size, CODE_ALPHA, 'middle')

	for (let row = 0; row < CODE_ROWS; row++) {
		const y = size.h * (CODE_ROW_TOP + row * CODE_ROW_STEP)

		ctx.fillText(row_text(row, tick), size.w * CODE_LEFT, y)
	}
}

function format_timer(t: number): string {
	const remaining = Math.max(0, Math.floor(COUNTDOWN_START_S - (t % COUNTDOWN_START_S)))
	const minutes = Math.floor(remaining / SECONDS_PER_MINUTE)
	const seconds = remaining % SECONDS_PER_MINUTE
	const mm = String(minutes).padStart(PAD_LENGTH, '0')
	const ss = String(seconds).padStart(PAD_LENGTH, '0')

	return `${mm}:${ss}`
}

function draw_timer(ctx: CanvasRenderingContext2D, size: ScreenSize, t: number): void {
	const font_size = size.h * TIMER_FONT_SCALE

	draw_helpers.set_text(ctx, font_size, FULL_ALPHA, 'middle')
	ctx.fillText(format_timer(t), size.w * TIMER_X, size.h * TIMER_Y)
}

export const draw_code_countdown: DisplayDrawer = (ctx, size, t) => {
	draw_helpers.clear_screen(ctx, size)
	draw_code_rows(ctx, size, t)
	draw_timer(ctx, size, t)
	draw_helpers.draw_label(ctx, size, 'LAUNCH CODE SEARCH')
}
