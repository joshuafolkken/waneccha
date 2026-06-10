<script lang="ts">
	import { T } from '@threlte/core'
	import { SCREEN_GLOW_COLOR } from '$lib/game/wargames/wargames-config'
	import { DoubleSide } from 'three'
	import { BOARD_EXTENT, board_layout, CELL_SIZE } from './board-layout'
	import Mark from './Mark.svelte'
	import { CELL_INDICES } from './tic-tac-toe'
	import { tic_tac_toe_game } from './TicTacToeGame.svelte'

	const GRID_THICK = 0.02
	const GRID_DEPTH = 0.005
	const GRID_Z = 0.01
	const MARK_Z = 0.03
	const HALF_DIVISOR = 2
	const DIVIDER_OFFSET = CELL_SIZE / HALF_DIVISOR
	const dividers = [-DIVIDER_OFFSET, DIVIDER_OFFSET]
</script>

<T.Group position.z={GRID_Z}>
	{#each dividers as offset (offset)}
		<T.Mesh position.x={offset}>
			<T.BoxGeometry args={[GRID_THICK, BOARD_EXTENT, GRID_DEPTH]} />
			<T.MeshBasicMaterial color={SCREEN_GLOW_COLOR} />
		</T.Mesh>
		<T.Mesh position.y={offset}>
			<T.BoxGeometry args={[BOARD_EXTENT, GRID_THICK, GRID_DEPTH]} />
			<T.MeshBasicMaterial color={SCREEN_GLOW_COLOR} />
		</T.Mesh>
	{/each}

	{#each CELL_INDICES as index (index)}
		{@const position = board_layout.cell_position(index)}
		{@const cell = tic_tac_toe_game.board[index] ?? null}
		<T.Mesh
			position={[position[0], position[1], 0]}
			onpointerdown={() => {
				tic_tac_toe_game.play(index)
			}}
		>
			<T.PlaneGeometry args={[CELL_SIZE, CELL_SIZE]} />
			<T.MeshBasicMaterial transparent opacity={0} side={DoubleSide} />
		</T.Mesh>
		{#if cell !== null}
			<T.Group position={[position[0], position[1], MARK_Z]}>
				<Mark mark={cell} size={CELL_SIZE} />
			</T.Group>
		{/if}
	{/each}
</T.Group>
