import { game_config } from './game-config'

// Pure HTML placeholder-injection used by the server hook's transformPageChunk. Kept in $lib (not
// hooks.server.ts) so it is unit-testable without importing a `.server` module.

const APP_VERSION_PLACEHOLDER = '__APP_VERSION__'
const GAME_NAME_DISPLAY_PLACEHOLDER = '__GAME_NAME_DISPLAY__'
const GAME_NAME_UPPER_PLACEHOLDER = '__GAME_NAME_UPPER__'

function html_escape(string_: string): string {
	return string_
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&#039;')
}

// Replace every literal placeholder with `value`. The function-replacer form makes `value`'s `$`
// sequences ($&, $1, …) insert verbatim instead of being interpreted as replacement patterns —
// required because version / game names are runtime, non-literal values (no-unsafe-string-replacement).
function inject_placeholder(html: string, placeholder: string, value: string): string {
	return html.replaceAll(placeholder, () => value)
}

function inject_version(html: string, version: string): string {
	return inject_placeholder(html, APP_VERSION_PLACEHOLDER, version)
}

function inject_game_name(html: string): string {
	const with_display = inject_placeholder(
		html,
		GAME_NAME_DISPLAY_PLACEHOLDER,
		html_escape(game_config.GAME_NAME_DISPLAY),
	)

	return inject_placeholder(
		with_display,
		GAME_NAME_UPPER_PLACEHOLDER,
		html_escape(game_config.GAME_NAME_UPPER),
	)
}

export const html_inject = {
	inject_placeholder,
	inject_version,
	inject_game_name,
}
