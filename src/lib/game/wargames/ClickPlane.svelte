<script lang="ts">
	import { T } from '@threlte/core'
	import { CLICK_PLANE_MATERIAL } from './click-plane-material'

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
	<T.MeshBasicMaterial {...CLICK_PLANE_MATERIAL} />
</T.Mesh>
