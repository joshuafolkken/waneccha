import { audio } from '@joshuafolkken/game-kit'
import type { GameStatus } from '$lib/game/tic-tac-toe/game-flow'
import { PLACE_TONE, SELECT_TONE, wopr_tones, type Tone } from './wopr-tones'

// WarGames/WOPR sound, synthesized over the shared Web Audio context (created by GameScene on
// the first user gesture). Every entry point no-ops while the context is null, so calls made
// before audio is unlocked are safe.

const MS_PER_S = 1000
const PEAK_GAIN = 0.18
const GAIN_FLOOR = 0.0001
const RAMP_UP_S = 0.01
const TAIL_S = 0.03
const STATUS_TONE_GAP_MS = 140

const HUM_FREQUENCY = 60
const HUM_GAIN = 0.04
const CHATTER_INTERVAL_MS = 900
const CHATTER_GAIN = 0.05
const CHATTER_MIN_HZ = 700
const CHATTER_STEPS = 5
const CHATTER_STEP_HZ = 80
const CHATTER_DURATION_S = 0.04

interface VoiceSpec {
	type: OscillatorType
	frequency: number
	start: number
	stop: number
	peak: number
}

interface Ambient {
	hum: OscillatorNode
	gain: GainNode
	chatter: ReturnType<typeof setInterval>
}

let ambient: Ambient | null = null
// Rotates the teletype blip pitch deterministically (no PRNG) for a churning-machine feel.
let chatter_step = 0

// One oscillator with a quick attack and exponential decay — the shared shape of every beep.
function schedule_voice(context: AudioContext, voice: VoiceSpec): void {
	const oscillator = context.createOscillator()
	const gain = context.createGain()

	oscillator.type = voice.type
	oscillator.frequency.value = voice.frequency
	gain.gain.setValueAtTime(GAIN_FLOOR, voice.start)
	gain.gain.exponentialRampToValueAtTime(voice.peak, voice.start + RAMP_UP_S)
	gain.gain.exponentialRampToValueAtTime(GAIN_FLOOR, voice.stop)
	oscillator.connect(gain).connect(context.destination)
	oscillator.start(voice.start)
	oscillator.stop(voice.stop + TAIL_S)
}

function play_tone(tone: Tone, delay_ms = 0): void {
	const context = audio.get_audio_context()

	if (context === null) return

	const start = context.currentTime + delay_ms / MS_PER_S

	schedule_voice(context, {
		type: tone.type,
		frequency: tone.frequency,
		start,
		stop: start + tone.duration_ms / MS_PER_S,
		peak: PEAK_GAIN,
	})
}

function play_mark(): void {
	play_tone(PLACE_TONE)
}

function play_select(): void {
	play_tone(SELECT_TONE)
}

function play_status(status: GameStatus): void {
	for (const [index, tone] of wopr_tones.status_tones(status).entries()) {
		play_tone(tone, index * STATUS_TONE_GAP_MS)
	}
}

// One short teletype/modem blip — the ambient bed fires these on an interval.
function play_chatter(): void {
	const context = audio.get_audio_context()

	if (context === null) return

	const start = context.currentTime
	const frequency = CHATTER_MIN_HZ + (chatter_step % CHATTER_STEPS) * CHATTER_STEP_HZ

	chatter_step += 1
	schedule_voice(context, {
		type: 'square',
		frequency,
		start,
		stop: start + CHATTER_DURATION_S,
		peak: CHATTER_GAIN,
	})
}

function start_ambient(): void {
	const context = audio.get_audio_context()

	if (context === null || ambient !== null) return

	const hum = context.createOscillator()
	const gain = context.createGain()

	hum.type = 'sawtooth'
	hum.frequency.value = HUM_FREQUENCY
	gain.gain.value = HUM_GAIN
	hum.connect(gain).connect(context.destination)
	hum.start()

	ambient = { hum, gain, chatter: setInterval(play_chatter, CHATTER_INTERVAL_MS) }
}

function stop_ambient(): void {
	if (ambient === null) return

	clearInterval(ambient.chatter)
	ambient.hum.stop()
	ambient.hum.disconnect()
	ambient.gain.disconnect()
	ambient = null
}

export const wopr_audio = {
	play_mark,
	play_select,
	play_status,
	start_ambient,
	stop_ambient,
}
