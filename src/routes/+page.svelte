<script lang="ts">
	import { device, GameScene } from '@joshuafolkken/game-kit'
	import { ALL_PLAYER_COUNTS } from '$lib/game/tic-tac-toe/game-mode'
	import { CELL_INDICES } from '$lib/game/tic-tac-toe/tic-tac-toe'
	import { tic_tac_toe_game } from '$lib/game/tic-tac-toe/TicTacToeGame.svelte'
	import { HINT_FONT_URL } from '$lib/game/wargames/hint-font'
	import { side_display_state } from '$lib/game/wargames/SideDisplayState.svelte'
	import WarRoom from '$lib/game/wargames/WarRoom.svelte'
	import WoprAudio from '$lib/game/wargames/WoprAudio.svelte'
	import { messages } from '$lib/messages'

	const hint_text = $derived(
		device.is_touch_primary ? messages.tap_to_start : messages.click_to_start,
	)
</script>

<GameScene
	{hint_text}
	hint_font={HINT_FONT_URL}
	label_jump={messages.jump_button}
	label_game={messages.game_application_label}
	label_game_started={messages.game_started_announcement}
	label_pause={messages.pause_button}
>
	<WarRoom />
</GameScene>

<WoprAudio />

<!-- Accessible, visually-hidden mirror of the cycling side displays. Lets E2E assert the
     foundation renders and the displays cycle without inspecting WebGL pixels. -->
<div
	class="sr-only"
	data-testid="side-display"
	data-left-id={side_display_state.left_id}
	data-right-id={side_display_state.right_id}
	aria-hidden="true"
></div>

<!-- Accessible fallback controls for the 3D tic-tac-toe board: keyboard/screen-reader play
     plus stable selectors for E2E (the WebGL cells handle pointer input). -->
<section class="sr-only" aria-label={messages.ttt_controls_label}>
	<p
		data-testid="ttt-board"
		data-cells={tic_tac_toe_game.serialized}
		data-status={tic_tac_toe_game.status}
		data-winner={tic_tac_toe_game.winner ?? ''}
		data-phase={tic_tac_toe_game.phase}
		data-player-count={tic_tac_toe_game.player_count ?? ''}
		data-variant={tic_tac_toe_game.variant}
		data-pending={tic_tac_toe_game.pending_removal}
	></p>
	<button
		type="button"
		data-testid="game-ttt"
		aria-label={messages.ttt_select_game_label}
		onclick={() => {
			tic_tac_toe_game.open_select()
		}}
	>
		{messages.wopr_board_title}
	</button>
	<button
		type="button"
		data-testid="variant-classic"
		aria-label={messages.ttt_variant_classic_label}
		onclick={() => {
			tic_tac_toe_game.set_variant('classic')
		}}
	>
		{messages.ttt_mode_classic}
	</button>
	<button
		type="button"
		data-testid="variant-infinite"
		aria-label={messages.ttt_variant_infinite_label}
		onclick={() => {
			tic_tac_toe_game.set_variant('infinite')
		}}
	>
		{messages.ttt_mode_infinite}
	</button>
	{#each ALL_PLAYER_COUNTS as count (count)}
		<button
			type="button"
			data-testid="select-{count}"
			aria-label="{messages.ttt_select_label}: {count}"
			onclick={() => {
				tic_tac_toe_game.start(count)
			}}
		>
			{count}
		</button>
	{/each}
	{#each CELL_INDICES as index (index)}
		<button
			type="button"
			data-testid="ttt-cell-{index}"
			aria-label="{messages.ttt_cell_label} {index + 1}"
			onclick={() => {
				tic_tac_toe_game.play(index)
			}}
		>
			{index + 1}
		</button>
	{/each}
	<button
		type="button"
		data-testid="ttt-reset"
		onclick={() => {
			tic_tac_toe_game.reset()
		}}
	>
		{messages.ttt_reset}
	</button>
	<button
		type="button"
		data-testid="ttt-back"
		onclick={() => {
			tic_tac_toe_game.to_select()
		}}
	>
		{messages.ttt_back}
	</button>
	<button
		type="button"
		data-testid="ttt-to-list"
		onclick={() => {
			tic_tac_toe_game.to_game_list()
		}}
	>
		{messages.ttt_games_header}
	</button>
</section>

<style>
	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}
</style>
