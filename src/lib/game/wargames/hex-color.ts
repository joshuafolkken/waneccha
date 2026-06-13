// Parse a six-digit hex color string into its 0–255 channel values. Shared by the palette
// and room-luminance tests so the hex-slicing logic lives in one place.
const HEX_RADIX = 16
const RED_START = 0
const GREEN_START = 2
const BLUE_START = 4
const CHANNEL_WIDTH = 2

export interface RgbChannels {
	red: number
	green: number
	blue: number
}

function hex_channels(hex: string): RgbChannels {
	const body = hex.replace('#', '')

	return {
		red: Number.parseInt(body.slice(RED_START, RED_START + CHANNEL_WIDTH), HEX_RADIX),
		green: Number.parseInt(body.slice(GREEN_START, GREEN_START + CHANNEL_WIDTH), HEX_RADIX),
		blue: Number.parseInt(body.slice(BLUE_START, BLUE_START + CHANNEL_WIDTH), HEX_RADIX),
	}
}

export { hex_channels }
