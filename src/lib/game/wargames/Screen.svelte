<script lang="ts">
	import { T } from '@threlte/core'
	import type { Snippet } from 'svelte'
	import { DoubleSide, EdgesGeometry, PlaneGeometry } from 'three'
	import { SCREEN_DIM_COLOR, SCREEN_GLOW_COLOR, SCREEN_OPACITY } from './wargames-config'

	const BORDER_OPACITY = 0.9

	interface Props {
		position: [number, number, number]
		rotation_y?: number
		width: number
		height: number
		children?: Snippet
	}

	const { position, rotation_y = 0, width, height, children }: Props = $props()

	// A translucent glass face with a glowing wire border framing the screen content.
	// EdgesGeometry copies the source, so the intermediate PlaneGeometry is freed immediately.
	const edges = $derived.by(() => {
		const source = new PlaneGeometry(width, height)
		const geometry = new EdgesGeometry(source)

		source.dispose()

		return geometry
	})

	// Dispose the border geometry when it is rebuilt (dimension change) or on unmount.
	$effect(() => {
		const current = edges

		return () => {
			current.dispose()
		}
	})
</script>

<T.Group {position} rotation.y={rotation_y}>
	<T.Mesh>
		<T.PlaneGeometry args={[width, height]} />
		<T.MeshBasicMaterial
			color={SCREEN_DIM_COLOR}
			transparent
			opacity={SCREEN_OPACITY}
			side={DoubleSide}
		/>
	</T.Mesh>
	<T.LineSegments geometry={edges}>
		<T.LineBasicMaterial color={SCREEN_GLOW_COLOR} transparent opacity={BORDER_OPACITY} />
	</T.LineSegments>
	{@render children?.()}
</T.Group>
