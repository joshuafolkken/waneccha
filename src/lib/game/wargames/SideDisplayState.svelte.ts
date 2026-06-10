import { side_display_cycle, type SideDisplayId } from './side-display-cycle'
import { SIDE_CYCLE_INTERVAL_MS } from './wargames-config'

// Right screen is offset half the cycle so the two side screens never show the same display
// at once — derived from the display count rather than hard-coded to the current list length.
const SIDE_SCREENS = 2
const RIGHT_OFFSET = Math.floor(side_display_cycle.display_count() / SIDE_SCREENS)

interface SideDisplayState {
	readonly left_id: SideDisplayId
	readonly right_id: SideDisplayId
	start: () => void
	stop: () => void
}

function create_side_display_state(): SideDisplayState {
	let index = $state(0)
	let timer: ReturnType<typeof setInterval> | null = null

	function start(): void {
		if (timer !== null) return

		timer = setInterval(() => {
			index = side_display_cycle.next_index(index)
		}, SIDE_CYCLE_INTERVAL_MS)
	}

	function stop(): void {
		if (timer === null) return

		clearInterval(timer)
		timer = null
	}

	return {
		get left_id(): SideDisplayId {
			return side_display_cycle.display_at(index)
		},
		get right_id(): SideDisplayId {
			return side_display_cycle.display_at(index + RIGHT_OFFSET)
		},
		start,
		stop,
	}
}

const side_display_state = create_side_display_state()

export { side_display_state }
