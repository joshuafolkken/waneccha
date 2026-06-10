// Pure typewriter-reveal logic for the WOPR game list: lines appear one at a time. Kept
// framework-free so the progression is node-testable; the component drives it on a timer.

function next(revealed: number, total: number): number {
	return Math.min(revealed + 1, total)
}

function is_complete(revealed: number, total: number): boolean {
	return revealed >= total
}

export const game_list_reveal = {
	next,
	is_complete,
}
