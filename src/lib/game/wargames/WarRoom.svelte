<script lang="ts">
	import { FloorCredits, Player, Room, ROOM_D, ROOM_H, ROOM_W } from '@joshuafolkken/game-kit'
	import { T } from '@threlte/core'
	import { interactivity } from '@threlte/extras'
	import { tic_tac_toe_game } from '$lib/game/tic-tac-toe/TicTacToeGame.svelte'
	import { messages } from '$lib/messages'
	import { onDestroy, onMount } from 'svelte'
	import CenterScreen from './CenterScreen.svelte'
	import {
		FLOOR_CREDITS_COLOR,
		FLOOR_CREDITS_END_Z,
		FLOOR_CREDITS_FONT_URL,
		FLOOR_CREDITS_IS_ALT,
		FLOOR_CREDITS_START_Z,
		FLOOR_CREDITS_TEXT,
	} from './floor-credits'
	import {
		AMBIENT_INTENSITY,
		CENTER_H,
		CENTER_POS,
		CENTER_W,
		LEFT_POS,
		POINT_INTENSITY,
		POINT_POS,
		RIGHT_POS,
		SIDE_H,
		SIDE_ROT,
		SIDE_W,
	} from './scene-layout'
	import Screen from './Screen.svelte'
	import { side_display_state } from './SideDisplayState.svelte'
	import SideScreen from './SideScreen.svelte'
	import {
		ROOM_CEILING_COLOR,
		ROOM_FLOOR_COLOR,
		ROOM_WALL_COLOR,
		SCENE_BG_COLOR,
		SCREEN_GLOW_COLOR,
	} from './wargames-config'

	// Shake the camera when a game finishes (WarGames drama).
	const is_over = $derived(
		tic_tac_toe_game.phase === 'playing' && tic_tac_toe_game.status !== 'playing',
	)

	// Enable pointer raycasting so the tic-tac-toe cells on the center screen are clickable.
	interactivity()

	onMount(() => {
		side_display_state.start()
	})
	onDestroy(() => {
		side_display_state.stop()
		tic_tac_toe_game.stop()
	})
</script>

<T.Color attach="background" args={[SCENE_BG_COLOR]} />
<Player is_gameover={is_over} />
<T.AmbientLight intensity={AMBIENT_INTENSITY} color={SCREEN_GLOW_COLOR} />
<T.PointLight position={POINT_POS} intensity={POINT_INTENSITY} color={SCREEN_GLOW_COLOR} />

<Room
	width={ROOM_W}
	depth={ROOM_D}
	height={ROOM_H}
	floor_color={ROOM_FLOOR_COLOR}
	wall_color={ROOM_WALL_COLOR}
	ceiling_color={ROOM_CEILING_COLOR}
/>

<FloorCredits
	is_alt={FLOOR_CREDITS_IS_ALT}
	credits={FLOOR_CREDITS_TEXT}
	scroll_start_z={FLOOR_CREDITS_START_Z}
	scroll_end_z={FLOOR_CREDITS_END_Z}
	font={FLOOR_CREDITS_FONT_URL}
	color={FLOOR_CREDITS_COLOR}
/>

<Screen position={CENTER_POS} width={CENTER_W} height={CENTER_H}>
	<CenterScreen title={messages.wopr_board_title} />
</Screen>

<Screen position={LEFT_POS} rotation_y={SIDE_ROT} width={SIDE_W} height={SIDE_H}>
	<SideScreen id={side_display_state.left_id} width={SIDE_W} height={SIDE_H} />
</Screen>

<Screen position={RIGHT_POS} rotation_y={-SIDE_ROT} width={SIDE_W} height={SIDE_H}>
	<SideScreen id={side_display_state.right_id} width={SIDE_W} height={SIDE_H} />
</Screen>
