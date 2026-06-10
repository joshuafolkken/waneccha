import { describe, expect, it } from 'vitest'
import { TIC_TAC_TOE_LABEL, WOPR_GAME_ENTRIES } from './wargames-games'

describe('WOPR_GAME_ENTRIES', () => {
	it('lists TIC-TAC-TOE first as the only selectable game', () => {
		expect(WOPR_GAME_ENTRIES[0]).toEqual({ label: TIC_TAC_TOE_LABEL, is_selectable: true })

		const selectable = WOPR_GAME_ENTRIES.filter((entry) => entry.is_selectable)

		expect(selectable).toHaveLength(1)
	})

	it('ends with the film’s final escalation', () => {
		const last = WOPR_GAME_ENTRIES.at(-1)

		expect(last?.label).toBe('GLOBAL THERMONUCLEAR WAR')
	})

	it('includes the iconic decorative entries', () => {
		const labels = WOPR_GAME_ENTRIES.map((entry) => entry.label)

		expect(labels).toContain("FALKEN'S MAZE")
		expect(labels).toContain('CHESS')
	})
})
