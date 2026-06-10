<script lang="ts">
	import { T } from '@threlte/core'
	import { Text } from '@threlte/extras'
	import { CONTENT_Z_OFFSET } from './scene-layout'
	import { SCREEN_GLOW_COLOR, TERMINAL_FONT_URL } from './wargames-config'

	interface Props {
		title: string
		subtitle: string
	}

	const { title, subtitle }: Props = $props()

	const TITLE_Y = 0.45
	const TITLE_SIZE = 0.22
	const SUBTITLE_Y = -0.1
	const SUBTITLE_SIZE = 0.12
</script>

<T.Group position.z={CONTENT_Z_OFFSET}>
	<Text
		text={title}
		font={TERMINAL_FONT_URL}
		fontSize={TITLE_SIZE}
		color={SCREEN_GLOW_COLOR}
		anchorX="center"
		anchorY="middle"
		position.y={TITLE_Y}
	/>
	<Text
		text={subtitle}
		font={TERMINAL_FONT_URL}
		fontSize={SUBTITLE_SIZE}
		color={SCREEN_GLOW_COLOR}
		anchorX="center"
		anchorY="middle"
		position.y={SUBTITLE_Y}
	/>
</T.Group>
