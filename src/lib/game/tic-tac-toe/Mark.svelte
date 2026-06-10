<script lang="ts">
	import { T } from '@threlte/core'
	import { SCREEN_GLOW_COLOR } from '$lib/game/wargames/wargames-config'
	import { DoubleSide } from 'three'
	import type { Mark } from './tic-tac-toe'

	interface Props {
		mark: Mark
		size: number
	}

	const { mark, size }: Props = $props()

	const RING_INNER_SCALE = 0.34
	const RING_OUTER_SCALE = 0.48
	const RING_SEGMENTS = 32
	const BAR_THICK_SCALE = 0.14
	const BAR_DEPTH = 0.01
	const QUARTER_DIVISOR = 4
	const QUARTER_TURN = Math.PI / QUARTER_DIVISOR
	const DIAMETER_FACTOR = 2

	const ring_inner = $derived(size * RING_INNER_SCALE)
	const ring_outer = $derived(size * RING_OUTER_SCALE)
	const bar_length = $derived(size * (RING_OUTER_SCALE * DIAMETER_FACTOR))
	const bar_thick = $derived(size * BAR_THICK_SCALE)
</script>

{#if mark === 'o'}
	<T.Mesh>
		<T.RingGeometry args={[ring_inner, ring_outer, RING_SEGMENTS]} />
		<T.MeshBasicMaterial color={SCREEN_GLOW_COLOR} side={DoubleSide} />
	</T.Mesh>
{:else}
	<T.Mesh rotation.z={QUARTER_TURN}>
		<T.BoxGeometry args={[bar_length, bar_thick, BAR_DEPTH]} />
		<T.MeshBasicMaterial color={SCREEN_GLOW_COLOR} />
	</T.Mesh>
	<T.Mesh rotation.z={-QUARTER_TURN}>
		<T.BoxGeometry args={[bar_length, bar_thick, BAR_DEPTH]} />
		<T.MeshBasicMaterial color={SCREEN_GLOW_COLOR} />
	</T.Mesh>
{/if}
