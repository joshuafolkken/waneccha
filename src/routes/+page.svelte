<script lang="ts">
	import { device, GameScene } from '@joshuafolkken/game-kit'
	import { side_display_state } from '$lib/game/wargames/SideDisplayState.svelte'
	import WarRoom from '$lib/game/wargames/WarRoom.svelte'
	import { messages } from '$lib/messages'

	const hint_text = $derived(
		device.is_touch_primary ? messages.tap_to_start : messages.click_to_start,
	)
</script>

<GameScene
	{hint_text}
	label_jump={messages.jump_button}
	label_game={messages.game_application_label}
	label_game_started={messages.game_started_announcement}
	label_pause={messages.pause_button}
>
	<WarRoom />
</GameScene>

<!-- Accessible, visually-hidden mirror of the cycling side displays. Lets E2E assert the
     foundation renders and the displays cycle without inspecting WebGL pixels. -->
<div
	class="sr-only"
	data-testid="side-display"
	data-left-id={side_display_state.left_id}
	data-right-id={side_display_state.right_id}
	aria-hidden="true"
></div>

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
