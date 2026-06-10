import { draw_code_countdown } from './code-countdown'
import { draw_defcon_status } from './defcon-status'
import type { DisplayDrawer } from './draw-helpers'
import { draw_norad_map } from './norad-map'
import { draw_radar_sweep } from './radar-sweep'
import type { SideDisplayId } from './side-display-cycle'

const DRAWERS: Record<SideDisplayId, DisplayDrawer> = {
	norad_map: draw_norad_map,
	radar_sweep: draw_radar_sweep,
	defcon_status: draw_defcon_status,
	code_countdown: draw_code_countdown,
}

function drawer_for(id: SideDisplayId): DisplayDrawer {
	return DRAWERS[id]
}

function has(id: string): id is SideDisplayId {
	return Object.hasOwn(DRAWERS, id)
}

export const side_displays = {
	drawer_for,
	has,
}
