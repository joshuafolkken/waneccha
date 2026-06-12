import { describe, expect, it } from 'vitest'
import { wopr_audio } from './wopr-audio'

// Without a Web Audio context (it is created on the first user gesture, and is absent in this
// environment), every entry point must no-op rather than throw.
describe('wopr_audio lifecycle safety', () => {
	it('no-ops without an audio context instead of throwing', () => {
		expect(() => {
			wopr_audio.play_mark()
			wopr_audio.play_select()
			wopr_audio.play_status('won')
			wopr_audio.play_status('draw')
			wopr_audio.start_ambient()
			wopr_audio.stop_ambient()
		}).not.toThrow()
	})

	it('stopping the ambient bed when none is running is safe', () => {
		expect(() => {
			wopr_audio.stop_ambient()
		}).not.toThrow()
	})
})
