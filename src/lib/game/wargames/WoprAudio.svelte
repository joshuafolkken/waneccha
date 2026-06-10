<script lang="ts">
	import type { GameStatus } from '$lib/game/tic-tac-toe/game-flow'
	import { tic_tac_toe_game, type GamePhase } from '$lib/game/tic-tac-toe/TicTacToeGame.svelte'
	import { onDestroy } from 'svelte'
	import { wopr_audio } from './wopr-audio'

	// Audio-only controller: watches the match store and synthesizes WOPR sound. Each `previous_*`
	// starts null so the first effect run only records state (no beep on mount).
	let previous_serialized: string | null = null
	let previous_phase: GamePhase | null = null
	let previous_status: GameStatus | null = null

	$effect(() => {
		const { serialized } = tic_tac_toe_game

		if (previous_serialized !== null && serialized !== previous_serialized) wopr_audio.play_mark()
		previous_serialized = serialized
	})

	$effect(() => {
		const { phase } = tic_tac_toe_game

		if (previous_phase !== null && phase !== previous_phase) wopr_audio.play_select()
		previous_phase = phase
	})

	$effect(() => {
		const { status } = tic_tac_toe_game

		if (previous_status !== null && status !== previous_status) wopr_audio.play_status(status)
		previous_status = status
	})

	$effect(() => {
		if (tic_tac_toe_game.phase === 'playing') wopr_audio.start_ambient()
		else wopr_audio.stop_ambient()
	})

	onDestroy(() => {
		wopr_audio.stop_ambient()
	})
</script>
