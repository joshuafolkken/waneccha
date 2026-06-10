import { SCREEN_GLOW_COLOR, TERMINAL_FONT_FAMILY } from './wargames-config'

export interface ScreenSize {
	w: number
	h: number
}

export type DisplayDrawer = (ctx: CanvasRenderingContext2D, size: ScreenSize, t: number) => void

const BG_COLOR = '#02160c'
const LABEL_FONT_SCALE = 0.07
const LABEL_PAD_SCALE = 0.5
const FULL_TURN_HALVES = 2
const FULL_ALPHA = 1

export const TWO_PI = Math.PI * FULL_TURN_HALVES
export const HALF = 0.5

function clear_screen(ctx: CanvasRenderingContext2D, size: ScreenSize): void {
	ctx.fillStyle = BG_COLOR
	ctx.fillRect(0, 0, size.w, size.h)
}

function set_glow(ctx: CanvasRenderingContext2D, alpha: number): void {
	ctx.strokeStyle = SCREEN_GLOW_COLOR
	ctx.fillStyle = SCREEN_GLOW_COLOR
	ctx.globalAlpha = alpha
}

function draw_label(ctx: CanvasRenderingContext2D, size: ScreenSize, text: string): void {
	const font_size = size.h * LABEL_FONT_SCALE
	const pad = font_size * LABEL_PAD_SCALE

	ctx.globalAlpha = FULL_ALPHA
	ctx.fillStyle = SCREEN_GLOW_COLOR
	ctx.font = `${String(font_size)}px ${TERMINAL_FONT_FAMILY}, monospace`
	ctx.textBaseline = 'top'
	ctx.fillText(text, pad, pad)
}

export const draw_helpers = {
	clear_screen,
	set_glow,
	draw_label,
}
