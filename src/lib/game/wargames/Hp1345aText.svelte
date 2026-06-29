<script lang="ts">
	import { T, useTask, useThrelte } from '@threlte/core'
	import { onDestroy } from 'svelte'
	import type { ColorRepresentation } from 'three'
	import { LineSegments2 } from 'three/examples/jsm/lines/LineSegments2.js'
	import { LineSegmentsGeometry } from 'three/examples/jsm/lines/LineSegmentsGeometry.js'
	import { hp1345a_font } from './hp1345a-font'
	import { hp1345a_materials } from './hp1345a-materials'
	import { SCREEN_GLOW_COLOR } from './wargames-config'

	// Renders text in the HP1345A vector font (the WarGames NORAD big-board display font) as 3D
	// fat-line geometry. A bright core plus several concentric MAX-blended halo layers give a glowing
	// surround without scene-wide post-processing (option B) — see hp1345a-materials for the why.
	interface Props {
		text: string
		size?: number
		color?: ColorRepresentation
		position?: [number, number, number]
		rotation_y?: number
	}

	const DEFAULT_SIZE = 0.22
	const ORIGIN: [number, number, number] = [0, 0, 0]

	const {
		text,
		size = DEFAULT_SIZE,
		color = SCREEN_GLOW_COLOR,
		position = ORIGIN,
		rotation_y = 0,
	}: Props = $props()

	const { size: viewport } = useThrelte()

	// One geometry shared by the core and every halo layer; fat lines are sized in world units so the
	// glow scales with the scene rather than with the pixel resolution.
	const geometry = new LineSegmentsGeometry()
	const materials = hp1345a_materials.create()
	const core = new LineSegments2(geometry, materials.core)
	const glows = materials.glow_layers.map((layer) => new LineSegments2(geometry, layer))

	const positions = $derived(hp1345a_font.to_line_positions(text, size))
	const has_geometry = $derived(positions.length > 0)

	$effect(() => {
		if (has_geometry) geometry.setPositions(positions)
	})

	$effect(() => {
		hp1345a_materials.apply_size(materials, size)
		materials.core.color.set(color)
	})

	// LineMaterial needs the drawing-buffer resolution to rasterize fat lines; keep it in sync so the
	// text stays correct across viewport resizes.
	useTask(() => {
		const { width, height } = viewport.current

		materials.core.resolution.set(width, height)
		for (const layer of materials.glow_layers) layer.resolution.set(width, height)
	})

	onDestroy(() => {
		geometry.dispose()
		materials.core.dispose()
		for (const layer of materials.glow_layers) layer.dispose()
	})
</script>

{#if has_geometry}
	<T.Group {position} rotation.y={rotation_y}>
		{#each glows as glow_line, index (index)}
			<T is={glow_line} />
		{/each}
		<T is={core} />
	</T.Group>
{/if}
