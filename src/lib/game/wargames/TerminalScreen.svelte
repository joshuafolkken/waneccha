<script lang="ts">
	import { T } from '@threlte/core'
	import { DoubleSide } from 'three'
	import { hp1345a_font } from './hp1345a-font'
	import Hp1345aText from './Hp1345aText.svelte'
	import { TERMINAL_TEXT_COLOR } from './wargames-config'

	// A WarGames CRT terminal panel: an opaque dark screen framed by a thick solid white border (the
	// border is a larger white plane showing around the smaller dark face), with the message rendered
	// top-left in the HP1345A vector font, auto-shrunk so every line fits — matched to the movie's
	// white-bordered console screen.
	interface Props {
		position: [number, number, number]
		rotation_y?: number
		width: number
		height: number
		text: string
	}

	const { position, rotation_y = 0, width, height, text }: Props = $props()

	const TWO = 2
	const BORDER = 0.023
	const PADDING = 0.22
	const FRAME_Z = 0.01
	const TEXT_Z = 0.02
	const TEXT_WEIGHT = 2.5
	const CONDENSE = 0.8
	const LETTER_SPACING = 0.85
	const LINE_SPACING = 1.45
	const TEXT_COLOR = TERMINAL_TEXT_COLOR
	const BORDER_COLOR = '#ffffff'
	const SCREEN_COLOR = '#070b18'

	const inner_w = $derived(width - BORDER * TWO)
	const inner_h = $derived(height - BORDER * TWO)
	const content_w = $derived(width - PADDING * TWO)
	const content_h = $derived(height - PADDING * TWO)
	const text_size = $derived(
		hp1345a_font.fit_size(text, content_w, content_h, {
			letter_spacing: LETTER_SPACING,
			line_spacing: LINE_SPACING,
		}),
	)
	const text_position = $derived<[number, number, number]>([
		-width / TWO + PADDING,
		height / TWO - PADDING,
		TEXT_Z,
	])
</script>

<T.Group {position} rotation.y={rotation_y}>
	<T.Mesh>
		<T.PlaneGeometry args={[width, height]} />
		<T.MeshBasicMaterial color={BORDER_COLOR} side={DoubleSide} />
	</T.Mesh>
	<T.Mesh position.z={FRAME_Z}>
		<T.PlaneGeometry args={[inner_w, inner_h]} />
		<T.MeshBasicMaterial color={SCREEN_COLOR} side={DoubleSide} />
	</T.Mesh>
	<Hp1345aText
		{text}
		size={text_size}
		weight={TEXT_WEIGHT}
		condense={CONDENSE}
		letter_spacing={LETTER_SPACING}
		line_spacing={LINE_SPACING}
		color={TEXT_COLOR}
		align="left"
		valign="top"
		position={text_position}
	/>
</T.Group>
