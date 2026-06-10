<script lang="ts">
	import { T } from '@threlte/core'
	import { Text } from '@threlte/extras'
	import { tic_tac_toe_game } from '$lib/game/tic-tac-toe/TicTacToeGame.svelte'
	import { messages } from '$lib/messages'
	import { onDestroy, onMount } from 'svelte'
	import ClickPlane from './ClickPlane.svelte'
	import { game_list_reveal } from './game-list-reveal'
	import { CONTENT_Z_OFFSET } from './scene-layout'
	import { SCREEN_GLOW_COLOR, TERMINAL_FONT_URL } from './wargames-config'
	import { WOPR_GAME_ENTRIES } from './wargames-games'

	const REVEAL_INTERVAL_MS = 90
	const HEADER_Y = 0.82
	const HEADER_SIZE = 0.11
	const LIST_START_Y = 0.62
	const LINE_STEP = 0.092
	const ENTRY_SIZE = 0.062
	const ENTRY_W = 1.9
	const ENTRY_TEXT_Z = 0.01
	const SELECTABLE_OPACITY = 1
	const DECOR_OPACITY = 0.5

	const TOTAL = WOPR_GAME_ENTRIES.length

	let revealed = $state(1)
	let timer: ReturnType<typeof setInterval> | null = null

	const visible = $derived(WOPR_GAME_ENTRIES.slice(0, revealed))

	function stop_timer(): void {
		if (timer === null) return

		clearInterval(timer)
		timer = null
	}

	onMount(() => {
		timer = setInterval(() => {
			revealed = game_list_reveal.next(revealed, TOTAL)

			if (game_list_reveal.is_complete(revealed, TOTAL)) stop_timer()
		}, REVEAL_INTERVAL_MS)
	})

	onDestroy(stop_timer)
</script>

<T.Group position.z={CONTENT_Z_OFFSET}>
	<Text
		text={messages.ttt_games_header}
		font={TERMINAL_FONT_URL}
		fontSize={HEADER_SIZE}
		color={SCREEN_GLOW_COLOR}
		anchorX="center"
		anchorY="middle"
		position.y={HEADER_Y}
	/>

	{#each visible as entry, index (entry.label)}
		<T.Group position.y={LIST_START_Y - index * LINE_STEP}>
			{#if entry.is_selectable}
				<ClickPlane
					width={ENTRY_W}
					height={LINE_STEP}
					onpress={() => {
						tic_tac_toe_game.open_select()
					}}
				/>
			{/if}
			<Text
				text={entry.label}
				font={TERMINAL_FONT_URL}
				fontSize={ENTRY_SIZE}
				color={SCREEN_GLOW_COLOR}
				fillOpacity={entry.is_selectable ? SELECTABLE_OPACITY : DECOR_OPACITY}
				anchorX="center"
				anchorY="middle"
				position.z={ENTRY_TEXT_Z}
			/>
		</T.Group>
	{/each}
</T.Group>
