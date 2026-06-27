import { describe, expect, it } from 'vitest'
import { game_config } from './game-config'
import { html_inject } from './html-inject'

describe('html_inject.inject_placeholder', () => {
	it('replaces every occurrence of the placeholder with the value', () => {
		expect(html_inject.inject_placeholder('a __P__ b __P__', '__P__', 'X')).toBe('a X b X')
	})

	it('inserts the value literally, not as a String.replaceAll pattern', () => {
		// `$&` / `$1` / `$$` are special in a string replacement; the function-replacer form must
		// keep them verbatim (regression guard for the no-unsafe-string-replacement fix).
		expect(html_inject.inject_placeholder('x__P__y', '__P__', '$& $1 $$')).toBe('x$& $1 $$y')
	})
})

describe('html_inject.inject_version', () => {
	it('replaces the version placeholder with the given version', () => {
		expect(html_inject.inject_version('app=__APP_VERSION__', '1.2.3')).toBe('app=1.2.3')
	})
})

describe('html_inject.inject_game_name', () => {
	it('replaces both game-name placeholders with the configured names', () => {
		const out = html_inject.inject_game_name('__GAME_NAME_DISPLAY__ / __GAME_NAME_UPPER__')

		expect(out).toBe(`${game_config.GAME_NAME_DISPLAY} / ${game_config.GAME_NAME_UPPER}`)
	})
})
