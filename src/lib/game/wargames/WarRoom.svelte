<script lang="ts">
	import { Room, ROOM_D, ROOM_H, ROOM_W } from '@joshuafolkken/game-kit'
	import { T } from '@threlte/core'
	import { messages } from '$lib/messages'
	import { onDestroy, onMount } from 'svelte'
	import CenterScreen from './CenterScreen.svelte'
	import {
		AMBIENT_INTENSITY,
		CAMERA_FOV,
		CAMERA_Y,
		CAMERA_Z,
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

	const CAMERA_POS: [number, number, number] = [0, CAMERA_Y, CAMERA_Z]

	onMount(() => {
		side_display_state.start()
	})
	onDestroy(() => {
		side_display_state.stop()
	})
</script>

<T.Color attach="background" args={[SCENE_BG_COLOR]} />
<T.PerspectiveCamera makeDefault position={CAMERA_POS} fov={CAMERA_FOV} />
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

<Screen position={CENTER_POS} width={CENTER_W} height={CENTER_H}>
	<CenterScreen title={messages.wopr_board_title} subtitle={messages.wopr_board_standby} />
</Screen>

<Screen position={LEFT_POS} rotation_y={SIDE_ROT} width={SIDE_W} height={SIDE_H}>
	<SideScreen id={side_display_state.left_id} width={SIDE_W} height={SIDE_H} />
</Screen>

<Screen position={RIGHT_POS} rotation_y={-SIDE_ROT} width={SIDE_W} height={SIDE_H}>
	<SideScreen id={side_display_state.right_id} width={SIDE_W} height={SIDE_H} />
</Screen>
