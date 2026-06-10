<script lang="ts">
	import { T, useTask } from '@threlte/core'
	import { onDestroy } from 'svelte'
	import { CanvasTexture, DoubleSide, LinearFilter } from 'three'
	import { CONTENT_Z_OFFSET } from './scene-layout'
	import type { SideDisplayId } from './side-display-cycle'
	import { side_displays } from './side-displays'

	interface Props {
		id: SideDisplayId
		width: number
		height: number
	}

	const { id, width, height }: Props = $props()

	const TEX_W = 512
	const TEX_H = 400
	const CONTENT_OPACITY = 0.85

	const canvas = document.createElement('canvas')
	canvas.width = TEX_W
	canvas.height = TEX_H
	const ctx = canvas.getContext('2d')
	const texture = new CanvasTexture(canvas)
	texture.minFilter = LinearFilter

	let elapsed = 0

	useTask((delta: number) => {
		if (!ctx) return
		elapsed += delta
		side_displays.drawer_for(id)(ctx, { w: TEX_W, h: TEX_H }, elapsed)
		texture.needsUpdate = true
	})

	onDestroy(() => {
		texture.dispose()
	})
</script>

<T.Mesh position.z={CONTENT_Z_OFFSET}>
	<T.PlaneGeometry args={[width, height]} />
	<T.MeshBasicMaterial map={texture} transparent opacity={CONTENT_OPACITY} side={DoubleSide} />
</T.Mesh>
