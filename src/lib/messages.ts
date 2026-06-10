import { base_messages } from '@joshuafolkken/game-kit'
import { game_config } from './game-config'

const game_messages = {
	game_title: game_config.GAME_NAME_UPPER,
	game_application_label: game_config.GAME_APP_LABEL,
	wopr_board_title: 'TIC-TAC-TOE',
	wopr_board_standby: 'STANDBY',
	ttt_your_move: 'YOUR MOVE',
	ttt_wopr_wins: 'WOPR WINS',
	ttt_you_win: 'YOU WIN',
	ttt_draw: 'DRAW',
	ttt_reset: 'NEW GAME',
	ttt_controls_label: 'Tic-tac-toe board',
	ttt_cell_label: 'Play cell',
} as const

const messages = { ...base_messages, ...game_messages } as const

export { game_messages, messages }
