import { describe, expect, it } from 'vitest'

import { joinBase } from './basePath'

describe('joinBase', () => {
  it('joins when the base already ends in a slash', () => {
    expect(joinBase('/stop_and_search/', 'data/snapshot.json')).toBe(
      '/stop_and_search/data/snapshot.json'
    )
  })

  it('joins when the base omits the trailing slash', () => {
    // This is what actions/configure-pages reports, and interpolating it
    // directly produced '/stop_and_searchdata/snapshot.json' in production.
    expect(joinBase('/stop_and_search', 'data/snapshot.json')).toBe(
      '/stop_and_search/data/snapshot.json'
    )
  })

  it('handles the root base used in development', () => {
    expect(joinBase('/', 'data/snapshot.json')).toBe('/data/snapshot.json')
  })

  it('does not double the slash when the path is absolute', () => {
    expect(joinBase('/stop_and_search/', '/data/snapshot.json')).toBe(
      '/stop_and_search/data/snapshot.json'
    )
    expect(joinBase('/stop_and_search', '/data/snapshot.json')).toBe(
      '/stop_and_search/data/snapshot.json'
    )
  })

  it('works for a bare filename such as the favicon', () => {
    expect(joinBase('/stop_and_search', 'fleur_de_lis_blue.ico')).toBe(
      '/stop_and_search/fleur_de_lis_blue.ico'
    )
  })

  it('handles an absolute base URL', () => {
    expect(joinBase('https://example.org/app', 'data/snapshot.json')).toBe(
      'https://example.org/app/data/snapshot.json'
    )
  })
})
