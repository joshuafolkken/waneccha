import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import {
	FLOOR_CREDITS_COLOR,
	FLOOR_CREDITS_END_Z,
	FLOOR_CREDITS_FONT_URL,
	FLOOR_CREDITS_START_Z,
	FLOOR_CREDITS_TEXT,
} from './floor-credits'

// WOFF files start with the signature 'wOFF' (0x774f4646).
const WOFF_MAGIC = [0x77, 0x4f, 0x46, 0x46]

describe('WarGames floor credits', () => {
	it('restores the credits roll dropped when the scene became WarGames', () => {
		expect(FLOOR_CREDITS_TEXT).toContain('CREDITS')
		expect(FLOOR_CREDITS_TEXT).toContain('THANK YOU FOR PLAYING !!')
	})

	it('thanks @armeria_game, which was missing versus the mnemecha credits', () => {
		expect(FLOOR_CREDITS_TEXT).toContain('@armeria_game')
	})

	it('credits the 1983 film WarGames as the inspiration, not the Simon memory game', () => {
		expect(FLOOR_CREDITS_TEXT).toContain('1983 film WarGames')
		expect(FLOOR_CREDITS_TEXT).toContain('John Badham')
		expect(FLOOR_CREDITS_TEXT).not.toContain('Classic Electronic Memory Game')
	})

	it('credits Claude Opus 4.8 via Claude Code as the engineer, not the older models', () => {
		expect(FLOOR_CREDITS_TEXT).toContain('Claude Opus 4.8')
		expect(FLOOR_CREDITS_TEXT).toContain('via Claude Code')
		expect(FLOOR_CREDITS_TEXT).not.toContain('Sonnet 4.6')
		expect(FLOOR_CREDITS_TEXT).not.toContain('Opus 4.7')
	})

	it('scrolls from beyond the far edge of the room to beyond the near edge', () => {
		expect(FLOOR_CREDITS_START_Z).toBeGreaterThan(0)
		expect(FLOOR_CREDITS_END_Z).toBe(-FLOOR_CREDITS_START_Z)
	})

	it('renders in the pure red recommended by the font author (issue #37)', () => {
		expect(FLOOR_CREDITS_COLOR).toBe('#ff0000')
	})
})

describe('WarGames Title font (issue #37)', () => {
	it('points the credits font at the bundled WarGames Title woff', () => {
		expect(FLOOR_CREDITS_FONT_URL).toBe('/fonts/WarGamesTitle.woff')
	})

	it('ships a valid WOFF file at the referenced static path', () => {
		const bytes = readFileSync(`static${FLOOR_CREDITS_FONT_URL}`)

		expect([...bytes.subarray(0, WOFF_MAGIC.length)]).toEqual(WOFF_MAGIC)
	})

	it('credits Michael Walden under CC BY-NC-SA 4.0 (font BY obligation)', () => {
		expect(FLOOR_CREDITS_TEXT).toContain('Michael Walden')
		expect(FLOOR_CREDITS_TEXT).toContain('CC BY-NC-SA 4.0')
	})
})
