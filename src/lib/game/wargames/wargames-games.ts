// The WOPR game roster from WarGames (1983). Only TIC-TAC-TOE is playable here; the rest are
// movie-faithful flavor (decorative), like the side-screen display labels. Order: the playable
// game first, then the film's escalating list ending in GLOBAL THERMONUCLEAR WAR.

export interface GameEntry {
	label: string
	is_selectable: boolean
}

export const TIC_TAC_TOE_LABEL = 'TIC-TAC-TOE'

const DECORATIVE_GAMES: ReadonlyArray<string> = [
	"FALKEN'S MAZE",
	'BLACK JACK',
	'GIN RUMMY',
	'HEARTS',
	'BRIDGE',
	'CHECKERS',
	'CHESS',
	'POKER',
	'FIGHTER COMBAT',
	'GUERRILLA ENGAGEMENT',
	'DESERT WARFARE',
	'AIR-TO-GROUND ACTIONS',
	'THEATERWIDE TACTICAL WARFARE',
	'THEATERWIDE BIOTOXIC AND CHEMICAL WARFARE',
	'GLOBAL THERMONUCLEAR WAR',
]

export const WOPR_GAME_ENTRIES: ReadonlyArray<GameEntry> = [
	{ label: TIC_TAC_TOE_LABEL, is_selectable: true },
	...DECORATIVE_GAMES.map((label) => ({ label, is_selectable: false })),
]
