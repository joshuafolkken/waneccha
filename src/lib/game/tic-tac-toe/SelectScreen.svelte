<script lang="ts">
	import { T } from '@threlte/core'
	import { Text } from '@threlte/extras'
	import ClickPlane from '$lib/game/wargames/ClickPlane.svelte'
	import { CONTENT_Z_OFFSET } from '$lib/game/wargames/scene-layout'
	import { SCREEN_GLOW_COLOR, TERMINAL_FONT_URL } from '$lib/game/wargames/wargames-config'
	import { messages } from '$lib/messages'
	import type { PlayerCount } from './game-mode'
	import { tic_tac_toe_game } from './TicTacToeGame.svelte'

	const PROMPT_Y = 0.66
	const PROMPT_SIZE = 0.12
	const OPTION_START_Y = 0.3
	const OPTION_STEP = 0.26
	const OPTION_SIZE = 0.11
	const OPTION_W = 1.7
	const OPTION_H = 0.24
	const OPTION_TEXT_Z = 0.01
	const MODE_Y = -0.52
	const MODE_SIZE = 0.085
	const MODE_W = 1.7
	const MODE_H = 0.22

	interface Option {
		count: PlayerCount
		label: string
	}

	const OPTIONS: ReadonlyArray<Option> = [
		{ count: 1, label: messages.ttt_select_1 },
		{ count: 2, label: messages.ttt_select_2 },
		{ count: 0, label: messages.ttt_select_0 },
	]

	const mode_text = $derived(
		tic_tac_toe_game.variant === 'infinite'
			? messages.ttt_mode_infinite
			: messages.ttt_mode_classic,
	)

	function toggle_variant(): void {
		tic_tac_toe_game.set_variant(tic_tac_toe_game.variant === 'infinite' ? 'classic' : 'infinite')
	}
</script>

<T.Group position.z={CONTENT_Z_OFFSET}>
	<Text
		text={messages.ttt_prompt}
		font={TERMINAL_FONT_URL}
		fontSize={PROMPT_SIZE}
		color={SCREEN_GLOW_COLOR}
		anchorX="center"
		anchorY="middle"
		position.y={PROMPT_Y}
	/>

	{#each OPTIONS as option, index (option.count)}
		<T.Group position.y={OPTION_START_Y - index * OPTION_STEP}>
			<ClickPlane
				width={OPTION_W}
				height={OPTION_H}
				onpress={() => {
					tic_tac_toe_game.start(option.count)
				}}
			/>
			<Text
				text={option.label}
				font={TERMINAL_FONT_URL}
				fontSize={OPTION_SIZE}
				color={SCREEN_GLOW_COLOR}
				anchorX="center"
				anchorY="middle"
				position.z={OPTION_TEXT_Z}
			/>
		</T.Group>
	{/each}

	<T.Group position.y={MODE_Y}>
		<ClickPlane width={MODE_W} height={MODE_H} onpress={toggle_variant} />
		<Text
			text={mode_text}
			font={TERMINAL_FONT_URL}
			fontSize={MODE_SIZE}
			color={SCREEN_GLOW_COLOR}
			anchorX="center"
			anchorY="middle"
			position.z={OPTION_TEXT_Z}
		/>
	</T.Group>
</T.Group>
