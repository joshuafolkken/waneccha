import { describe, expect, it } from 'vitest'
import { status_message } from './status-message'

describe('status_message', () => {
	it('asks for the human move while playing', () => {
		expect(status_message.status_key('playing', null)).toBe('your_move')
	})

	it('announces a WOPR win when the AI (o) wins', () => {
		expect(status_message.status_key('won', 'o')).toBe('wopr_wins')
	})

	it('announces a human win when x wins', () => {
		expect(status_message.status_key('won', 'x')).toBe('you_win')
	})

	it('announces a draw', () => {
		expect(status_message.status_key('draw', null)).toBe('draw')
	})
})
