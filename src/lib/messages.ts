import { base_messages } from '@joshuafolkken/game-kit'
import { game_config } from './game-config'

// The WOPR's signature line, used as the tic-tac-toe prompt.
const WOPR_GAME_PROMPT = 'SHALL WE PLAY A GAME?'

const game_messages = {
	game_title: game_config.GAME_NAME_UPPER,
	game_application_label: game_config.GAME_APP_LABEL,
	wopr_board_title: 'TIC-TAC-TOE',
	wopr_board_standby: 'STANDBY',
	norad_banner:
		'GREETINGS PROFESSOR FALKEN\n\nHELLO\n\nA STRANGE GAME.\nTHE ONLY WINNING MOVE IS\nNOT TO PLAY.\n\nHOW ABOUT A NICE GAME OF CHESS?',
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
	ttt_mode_classic: 'MODE: CLASSIC',
	ttt_mode_infinite: 'MODE: INFINITE',
	ttt_variant_classic_label: 'Classic mode',
	ttt_variant_infinite_label: 'Infinite mode',
	ttt_prompt: WOPR_GAME_PROMPT,
	ttt_select_0: '0 — WOPR VS WOPR',
	ttt_select_1: '1 — VS WOPR',
	ttt_select_2: '2 — PLAYERS',
	ttt_select_label: 'How many players',
	ttt_back: 'BACK',
} as const

const messages = { ...base_messages, ...game_messages } as const

export { game_messages, messages }
