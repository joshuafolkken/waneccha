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
	ttt_x_wins: 'X WINS',
	ttt_o_wins: 'O WINS',
	ttt_draw: 'DRAW',
	ttt_reset: 'NEW GAME',
	ttt_controls_label: 'Tic-tac-toe board',
	ttt_cell_label: 'Play cell',
	ttt_games_header: 'GAMES',
	ttt_select_game_label: 'Select game',
	ttt_prompt: 'SHALL WE PLAY A GAME?',
	ttt_select_0: '0 — WOPR VS WOPR',
	ttt_select_1: '1 — VS WOPR',
	ttt_select_2: '2 — PLAYERS',
	ttt_select_label: 'How many players',
	ttt_back: 'BACK',
} as const

const messages = { ...base_messages, ...game_messages } as const

export { game_messages, messages }
