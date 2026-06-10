<script lang="ts">
	import { T } from '@threlte/core'
	import { Text } from '@threlte/extras'
	import { status_message, type StatusKey } from '$lib/game/tic-tac-toe/status-message'
	import TicTacToeBoard from '$lib/game/tic-tac-toe/TicTacToeBoard.svelte'
	import { tic_tac_toe_game } from '$lib/game/tic-tac-toe/TicTacToeGame.svelte'
	import { messages } from '$lib/messages'
	import { CONTENT_Z_OFFSET } from './scene-layout'
	import { SCREEN_GLOW_COLOR, TERMINAL_FONT_URL } from './wargames-config'

	interface Props {
		title: string
	}

	const { title }: Props = $props()

	const TITLE_Y = 0.8
	const TITLE_SIZE = 0.13
	const STATUS_Y = -0.8
	const STATUS_SIZE = 0.12

	const STATUS_LABELS: Record<StatusKey, string> = {
		your_move: messages.ttt_your_move,
		wopr_wins: messages.ttt_wopr_wins,
		you_win: messages.ttt_you_win,
		draw: messages.ttt_draw,
	}

	const status_text = $derived(
		STATUS_LABELS[status_message.status_key(tic_tac_toe_game.status, tic_tac_toe_game.winner)],
	)
</script>

<T.Group position.z={CONTENT_Z_OFFSET}>
	<Text
		text={title}
		font={TERMINAL_FONT_URL}
		fontSize={TITLE_SIZE}
		color={SCREEN_GLOW_COLOR}
		anchorX="center"
		anchorY="middle"
		position.y={TITLE_Y}
	/>
	<TicTacToeBoard />
	<Text
		text={status_text}
		font={TERMINAL_FONT_URL}
		fontSize={STATUS_SIZE}
		color={SCREEN_GLOW_COLOR}
		anchorX="center"
		anchorY="middle"
		position.y={STATUS_Y}
	/>
</T.Group>
