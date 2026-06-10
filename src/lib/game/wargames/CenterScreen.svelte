<script lang="ts">
	import { T } from '@threlte/core'
	import { Text } from '@threlte/extras'
	import SelectScreen from '$lib/game/tic-tac-toe/SelectScreen.svelte'
	import { status_message, type StatusKey } from '$lib/game/tic-tac-toe/status-message'
	import TicTacToeBoard from '$lib/game/tic-tac-toe/TicTacToeBoard.svelte'
	import { tic_tac_toe_game } from '$lib/game/tic-tac-toe/TicTacToeGame.svelte'
	import { messages } from '$lib/messages'
	import ClickPlane from './ClickPlane.svelte'
	import GameList from './GameList.svelte'
	import { CONTENT_Z_OFFSET } from './scene-layout'
	import { SCREEN_GLOW_COLOR, TERMINAL_FONT_URL } from './wargames-config'

	interface Props {
		title: string
	}

	const { title }: Props = $props()

	const TITLE_Y = 0.8
	const TITLE_SIZE = 0.13
	const STATUS_Y = -0.78
	const STATUS_SIZE = 0.12
	const BACK_Y = -0.92
	const BACK_SIZE = 0.08
	const BACK_W = 0.9
	const BACK_H = 0.16
	const BACK_TEXT_Z = 0.01

	const phase = $derived(tic_tac_toe_game.phase)

	// Back steps one screen: a game returns to player-count select, select returns to the list.
	function go_back(): void {
		if (phase === 'playing') tic_tac_toe_game.to_select()
		else tic_tac_toe_game.to_game_list()
	}

	const STATUS_LABELS: Record<StatusKey, string> = {
		your_move: messages.ttt_your_move,
		wopr_wins: messages.ttt_wopr_wins,
		you_win: messages.ttt_you_win,
		x_wins: messages.ttt_x_wins,
		o_wins: messages.ttt_o_wins,
		draw: messages.ttt_draw,
	}

	const status_text = $derived(
		STATUS_LABELS[
			status_message.status_key(
				tic_tac_toe_game.status,
				tic_tac_toe_game.winner,
				tic_tac_toe_game.player_count,
			)
		],
	)
</script>

<T.Group position.z={CONTENT_Z_OFFSET}>
	{#if phase === 'game_list'}
		<GameList />
	{:else}
		<Text
			text={title}
			font={TERMINAL_FONT_URL}
			fontSize={TITLE_SIZE}
			color={SCREEN_GLOW_COLOR}
			anchorX="center"
			anchorY="middle"
			position.y={TITLE_Y}
		/>
		{#if phase === 'playing'}
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
		{:else}
			<SelectScreen />
		{/if}
		<!-- Back affordance, shared by the select and playing screens (target chosen by phase). -->
		<T.Group position.y={BACK_Y}>
			<ClickPlane width={BACK_W} height={BACK_H} onpress={go_back} />
			<Text
				text={messages.ttt_back}
				font={TERMINAL_FONT_URL}
				fontSize={BACK_SIZE}
				color={SCREEN_GLOW_COLOR}
				anchorX="center"
				anchorY="middle"
				position.z={BACK_TEXT_Z}
			/>
		</T.Group>
	{/if}
</T.Group>
