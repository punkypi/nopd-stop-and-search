import { describe, expect, it } from 'vitest'

import { buildUrl, soqlString } from './socrata'

describe('buildUrl', () => {
  it('targets the NOLA dataset by default', () => {
    const url = new URL(buildUrl({ select: 'count(*)' }))
    expect(url.host).toBe('data.nola.gov')
    expect(url.pathname).toBe('/resource/nfft-hjwi.json')
  })

  it('maps each clause onto its SoQL parameter', () => {
    const url = new URL(
      buildUrl({
        select: 'vehiclemake, count(*) as total',
        where: "stopdescription = 'TRAFFIC VIOLATION'",
        group: 'vehiclemake',
        order: 'total desc',
        limit: 25,
        offset: 50
      })
    )
    expect(url.searchParams.get('$select')).toBe('vehiclemake, count(*) as total')
    expect(url.searchParams.get('$where')).toBe("stopdescription = 'TRAFFIC VIOLATION'")
    expect(url.searchParams.get('$group')).toBe('vehiclemake')
    expect(url.searchParams.get('$order')).toBe('total desc')
    expect(url.searchParams.get('$limit')).toBe('25')
    expect(url.searchParams.get('$offset')).toBe('50')
  })

  it('omits clauses that were not supplied', () => {
    const url = new URL(buildUrl({ select: 'count(*)' }))
    expect(url.searchParams.has('$where')).toBe(false)
    expect(url.searchParams.has('$limit')).toBe(false)
  })

  it('honours a domain and dataset override', () => {
    const url = new URL(buildUrl({ select: '*' }, { domain: 'example.org', dataset: 'abcd-1234' }))
    expect(url.host).toBe('example.org')
    expect(url.pathname).toBe('/resource/abcd-1234.json')
  })
})

describe('soqlString', () => {
  it('wraps a value in single quotes', () => {
    expect(soqlString('TRAFFIC VIOLATION')).toBe("'TRAFFIC VIOLATION'")
  })

  it('doubles embedded quotes so the clause cannot be broken out of', () => {
    expect(soqlString("O'Brien")).toBe("'O''Brien'")
  })
})
