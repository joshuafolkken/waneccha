import { readFileSync } from 'node:fs'
import { inflateSync } from 'node:zlib'
import { CREDITS_TEXT } from '$lib/game/credits'
import { describe, expect, it } from 'vitest'
import { HINT_FONT_URL } from './hint-font'

// WOFF files start with the signature 'wOFF' (0x774f4646).
const WOFF_MAGIC = [0x77, 0x4f, 0x46, 0x46]

// WOFF table-directory layout (offsets in bytes). Each 20-byte entry holds a 4-byte tag then
// uint32 offset / compressed-length / original-length. The `head` table carries the global glyph
// bounding box; its yMin/yMax sit 38/42 bytes in. See https://www.w3.org/TR/WOFF/ and OpenType.
const WOFF_NUM_TABLES_OFFSET = 12
const WOFF_DIR_OFFSET = 44
const WOFF_DIR_ENTRY_SIZE = 20
const TABLE_TAG_LENGTH = 4
const ENTRY_OFFSET_FIELD = 4
const ENTRY_COMPRESSED_LENGTH_FIELD = 8
const ENTRY_ORIGINAL_LENGTH_FIELD = 12
const HEAD_Y_MIN_OFFSET = 38
const HEAD_Y_MAX_OFFSET = 42

// The bundled font is normalized for game-kit's controls overlay (see hint-font.ts): every glyph
// is scaled up ~1.46x and shifted down. Upstream caps top out at yMax=1400 with a ~1700-unit
// global bounding box; the normalized font scales that box past 2100 while pulling the cap top
// below 1400 so anchorY="middle" centers the glyphs.
const UPSTREAM_CAP_Y_MAX = 1400
const SCALED_MIN_BLOCK_HEIGHT = 2100

interface HeadBounds {
	y_min: number
	y_max: number
}

function read_head_bounds(woff: Buffer): HeadBounds {
	const table_count = woff.readUInt16BE(WOFF_NUM_TABLES_OFFSET)

	for (let index = 0; index < table_count; index++) {
		const entry = WOFF_DIR_OFFSET + index * WOFF_DIR_ENTRY_SIZE

		if (woff.toString('ascii', entry, entry + TABLE_TAG_LENGTH) === 'head') {
			const offset = woff.readUInt32BE(entry + ENTRY_OFFSET_FIELD)
			const compressed_length = woff.readUInt32BE(entry + ENTRY_COMPRESSED_LENGTH_FIELD)
			const original_length = woff.readUInt32BE(entry + ENTRY_ORIGINAL_LENGTH_FIELD)
			const raw = woff.subarray(offset, offset + compressed_length)
			const head = compressed_length < original_length ? inflateSync(raw) : raw

			return {
				y_min: head.readInt16BE(HEAD_Y_MIN_OFFSET),
				y_max: head.readInt16BE(HEAD_Y_MAX_OFFSET),
			}
		}
	}

	throw new Error('head table not found in WOFF')
}

describe('WarGames Terminal hint font (issue #37)', () => {
	it('points the controls hint font at the bundled WarGames Terminal woff', () => {
		expect(HINT_FONT_URL).toBe('/fonts/WarGamesTerminal.woff')
	})

	it('ships a valid WOFF file at the referenced static path', () => {
		const bytes = readFileSync(`static${HINT_FONT_URL}`)

		expect([...bytes.subarray(0, WOFF_MAGIC.length)]).toEqual(WOFF_MAGIC)
	})

	it('scales glyphs up and centers them for game-kit anchorY="middle"', () => {
		const { y_min, y_max } = read_head_bounds(readFileSync(`static${HINT_FONT_URL}`))

		// Upscaled (taller bounding box) so the hint/WASD match the previous PressStart2P size,
		// and caps pulled below the upstream top so they center in the keys. Guards against
		// re-importing the smaller, off-center upstream font.
		expect(y_max - y_min).toBeGreaterThan(SCALED_MIN_BLOCK_HEIGHT)
		expect(y_max).toBeLessThan(UPSTREAM_CAP_Y_MAX)
	})

	it('credits Michael Walden under CC BY-NC-SA 4.0 (font BY obligation)', () => {
		expect(CREDITS_TEXT).toContain('WarGames Terminal')
		expect(CREDITS_TEXT).toContain('Michael Walden')
		expect(CREDITS_TEXT).toContain('CC BY-NC-SA 4.0')
	})
})
