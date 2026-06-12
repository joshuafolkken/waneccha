import { describe, expect, it } from 'vitest'
import { status_message } from './status-message'

describe('status_message', () => {
	it('asks for the human move while playing', () => {
		expect(status_message.status_key('playing', null, 1)).toBe('your_move')
	})

	it('one player: frames wins as human vs WOPR', () => {
		expect(status_message.status_key('won', 'o', 1)).toBe('wopr_wins')
		expect(status_message.status_key('won', 'x', 1)).toBe('you_win')
	})

	it('two players: uses neutral mark wins', () => {
		expect(status_message.status_key('won', 'x', 2)).toBe('x_wins')
		expect(status_message.status_key('won', 'o', 2)).toBe('o_wins')
	})

	it('announces a draw', () => {
		expect(status_message.status_key('draw', null, 1)).toBe('draw')
	})

	it('throws on the impossible won-without-winner state', () => {
		expect(() => status_message.status_key('won', null, 1)).toThrow(/winner/u)
	})
})
