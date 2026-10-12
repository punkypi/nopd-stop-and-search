import { describe, expect, it } from 'vitest'

import {
  MIN_CELL_STOPS,
  normalizeRace,
  NOT_RECORDED_RACE,
  rate,
  stopTypeSharesForRace,
  type RaceStopTypeCount
} from './outcomesByRace'

describe('rate', () => {
  it('suppresses a cell right at the edge of the floor', () => {
    expect(rate(5, MIN_CELL_STOPS - 1)).toBeNull()
  })

  it('computes a rate once the denominator clears the floor', () => {
    expect(rate(15, MIN_CELL_STOPS)).toBe(0.5)
  })

  it('suppresses a zero denominator rather than dividing by it', () => {
    expect(rate(0, 0)).toBeNull()
  })
})

describe('normalizeRace', () => {
  it('passes through a real recorded value unchanged', () => {
    expect(normalizeRace('BLACK')).toBe('BLACK')
  })

  it('treats a missing value the same as a blank one', () => {
    expect(normalizeRace(undefined)).toBe(NOT_RECORDED_RACE)
    expect(normalizeRace('   ')).toBe(NOT_RECORDED_RACE)
  })

  it('trims surrounding whitespace on a real value', () => {
    expect(normalizeRace('  WHITE  ')).toBe('WHITE')
  })
})

describe('stopTypeSharesForRace', () => {
  const ROWS: RaceStopTypeCount[] = [
    { race: 'BLACK', description: 'TRAFFIC VIOLATION', count: 60 },
    { race: 'BLACK', description: 'CALL FOR SERVICE', count: 40 },
    { race: 'WHITE', description: 'TRAFFIC VIOLATION', count: 90 },
    { race: 'WHITE', description: 'CALL FOR SERVICE', count: 10 }
  ]

  it('shares sum to 1 for a race present in the rows', () => {
    const shares = stopTypeSharesForRace(ROWS, 'BLACK')
    expect(shares.reduce((sum, row) => sum + row.share, 0)).toBeCloseTo(1, 10)
  })

  it('sorts busiest kind of stop first', () => {
    const shares = stopTypeSharesForRace(ROWS, 'WHITE')
    expect(shares[0]).toEqual({ description: 'TRAFFIC VIOLATION', share: 0.9 })
  })

  it('returns an empty array for a race absent from the rows', () => {
    expect(stopTypeSharesForRace(ROWS, 'ASIAN')).toEqual([])
  })

  it('returns an empty array for an empty input', () => {
    expect(stopTypeSharesForRace([], 'BLACK')).toEqual([])
  })
})
