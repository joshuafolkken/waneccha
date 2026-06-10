import type { GameStatus } from '$lib/game/tic-tac-toe/game-flow'

// Pure tone specs for the WarGames/WOPR sound palette. The Web Audio layer (wopr-audio.ts)
// turns these into oscillator beeps; keeping the specs framework-free makes them node-testable.

export interface Tone {
	frequency: number
	duration_ms: number
	type: OscillatorType
}

export const PLACE_TONE: Tone = { frequency: 392, duration_ms: 70, type: 'square' }
export const SELECT_TONE: Tone = { frequency: 587, duration_ms: 90, type: 'square' }

const WIN_TONES: ReadonlyArray<Tone> = [
	{ frequency: 523, duration_ms: 110, type: 'square' },
	{ frequency: 784, duration_ms: 180, type: 'square' },
]

const DRAW_TONES: ReadonlyArray<Tone> = [{ frequency: 175, duration_ms: 320, type: 'sawtooth' }]

function status_tones(status: GameStatus): ReadonlyArray<Tone> {
	if (status === 'won') return WIN_TONES
	if (status === 'draw') return DRAW_TONES

	return []
}

export const wopr_tones = {
	PLACE_TONE,
	SELECT_TONE,
	status_tones,
}
