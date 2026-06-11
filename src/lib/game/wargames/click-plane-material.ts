import { DoubleSide } from 'three'

// Material for the invisible pointer hit-areas (menu options, board cells, back button).
// `depthWrite` MUST be false: a transparent, fully-invisible mesh that writes depth still
// occludes whatever is rendered behind it, blacking out the scene near screen center. This
// mirrors the fix game-kit's own Switch hit-area uses (`transparent opacity={0} depthWrite={false}`).
export const CLICK_PLANE_MATERIAL = {
	transparent: true,
	opacity: 0,
	depthWrite: false,
	side: DoubleSide,
} as const
