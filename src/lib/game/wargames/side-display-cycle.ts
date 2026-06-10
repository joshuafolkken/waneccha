// Pure, framework-free cycle logic for the left/right WarGames side screens.
// The screens rotate through four movie-inspired displays on a fixed timer.

export type SideDisplayId = 'norad_map' | 'radar_sweep' | 'defcon_status' | 'code_countdown'

const SIDE_DISPLAYS = [
	'norad_map',
	'radar_sweep',
	'defcon_status',
	'code_countdown',
] as const satisfies ReadonlyArray<SideDisplayId>

function display_count(): number {
	return SIDE_DISPLAYS.length
}

function next_index(index: number): number {
	return (index + 1) % SIDE_DISPLAYS.length
}

function display_at(index: number): SideDisplayId {
	const count = SIDE_DISPLAYS.length
	const normalized = ((index % count) + count) % count

	return SIDE_DISPLAYS[normalized] ?? SIDE_DISPLAYS[0]
}

function index_for_elapsed(elapsed_ms: number, interval_ms: number): number {
	if (interval_ms <= 0) return 0
	const ticks = Math.floor(Math.max(0, elapsed_ms) / interval_ms)

	return ticks % SIDE_DISPLAYS.length
}

export const side_display_cycle = {
	SIDE_DISPLAYS,
	display_count,
	next_index,
	display_at,
	index_for_elapsed,
}
