<script lang="ts">
	import { T } from '@threlte/core'
	import { DoubleSide } from 'three'

	// A transparent, double-sided clickable plane — the shared hotspot primitive for 3D screen
	// controls (board cells, menu options, back button). Place content (mark / label) alongside.
	interface Props {
		width: number
		height: number
		onpress: () => void
	}

	const { width, height, onpress }: Props = $props()
</script>

<T.Mesh
	onpointerdown={() => {
		onpress()
	}}
>
	<T.PlaneGeometry args={[width, height]} />
	<T.MeshBasicMaterial transparent opacity={0} side={DoubleSide} />
</T.Mesh>
