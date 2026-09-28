import { mount } from '@vue/test-utils'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { nextTick } from 'vue'

import { MAX_MARKER_RADIUS, MIN_MARKER_RADIUS, type StopLocation } from '@/lib/stopLocations'

import StopMap from './StopMap.vue'

/**
 * jsdom has no 2D canvas context, so the component's capability probe falls back
 * to Leaflet's SVG renderer. That is what makes these assertions possible: each
 * circle becomes a real `<path>` in the document, so the wiring from
 * `markerRadius` into Leaflet is observable rather than having to be trusted.
 *
 * jsdom performs no layout either, so `clientWidth`/`clientHeight` are always 0.
 * Leaflet reads those for its viewport, decides every circle lies outside it, and
 * draws each one as the degenerate path `M0 0` with no radius in it. Giving the
 * element a size is what makes the radius observable at all.
 */
const VIEWPORT = { width: 800, height: 600 }

beforeAll(() => {
  Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
    configurable: true,
    get: () => VIEWPORT.width
  })
  Object.defineProperty(HTMLElement.prototype, 'clientHeight', {
    configurable: true,
    get: () => VIEWPORT.height
  })
})

afterAll(() => {
  Reflect.deleteProperty(HTMLElement.prototype, 'clientWidth')
  Reflect.deleteProperty(HTMLElement.prototype, 'clientHeight')
})

function radiiOf(wrapper: ReturnType<typeof mount>): number[] {
  return [...wrapper.element.querySelectorAll('path.leaflet-interactive')].map((path) => {
    // Leaflet draws a circle as two arcs: `M{x},{y}a{r},{r} 0 1,0 ...`.
    const match = /a([\d.]+),/.exec(path.getAttribute('d') ?? '')
    return match ? Number(match[1]) : Number.NaN
  })
}

function normalisedText(wrapper: ReturnType<typeof mount>): string {
  return wrapper.text().replace(/\s+/g, ' ')
}

const BUSY: StopLocation = {
  latitude: 29.9511,
  longitude: -90.0715,
  count: 100,
  address: 'Canal St & N Rampart St'
}
const QUIET: StopLocation = {
  latitude: 30.0046,
  longitude: -90.1082,
  count: 1,
  address: 'Canal Blvd & Harrison Av'
}

function mountMap(props: Partial<InstanceType<typeof StopMap>['$props']> = {}) {
  return mount(StopMap, {
    attachTo: document.body,
    props: { locations: [BUSY, QUIET], rangeTotal: 120, ...props }
  })
}

describe('StopMap', () => {
  it('draws one circle per location', () => {
    const wrapper = mountMap()
    expect(radiiOf(wrapper)).toHaveLength(2)
    wrapper.unmount()
  })

  it('sizes the circles by stop count', () => {
    const wrapper = mountMap()
    const [busy, quiet] = radiiOf(wrapper)
    // Leaflet rounds the radius to whole pixels before drawing.
    expect(busy).toBe(Math.round(MAX_MARKER_RADIUS))
    expect(quiet).toBe(Math.round(MIN_MARKER_RADIUS))
    wrapper.unmount()
  })

  it('states how much of the range the map accounts for', () => {
    // The dataset only began recording coordinates in 2018 and still misses
    // some, so the map is routinely a subset of the headline total. Leaving that
    // unsaid would let the map quietly under-report.
    const wrapper = mountMap()
    expect(normalisedText(wrapper)).toContain(
      '101 of 120 stops have a recorded location, at 2 places'
    )
    wrapper.unmount()
  })

  it('says when a range has no located stops at all, and why', () => {
    const wrapper = mountMap({ locations: [], rangeTotal: 500 })
    const text = normalisedText(wrapper)
    expect(text).toContain('No stops in this range have a recorded location')
    expect(text).toContain('2018')
    expect(radiiOf(wrapper)).toHaveLength(0)
    wrapper.unmount()
  })

  it('discloses that the busiest locations were shown in place of all of them', () => {
    const wrapper = mountMap({ truncated: true })
    expect(normalisedText(wrapper)).toContain('busiest locations only')
    wrapper.unmount()
  })

  it('redraws when the range brings a different set of locations', async () => {
    const wrapper = mountMap({ locations: [BUSY] })
    expect(radiiOf(wrapper)).toHaveLength(1)

    await wrapper.setProps({ locations: [BUSY, QUIET, { ...QUIET, latitude: 29.99 }] })
    await nextTick()

    expect(radiiOf(wrapper)).toHaveLength(3)
    wrapper.unmount()
  })

  it('explains that circle area, not radius, carries the count', () => {
    // A reader cannot judge a bubble map without being told how it is scaled.
    const wrapper = mountMap()
    expect(normalisedText(wrapper)).toContain('Circle area is proportional')
    wrapper.unmount()
  })

  it('credits the basemap, as Esri requires', () => {
    const wrapper = mountMap()
    const attribution = wrapper.element.querySelector('.leaflet-control-attribution')?.innerHTML
    expect(attribution).toContain('Esri')
    expect(attribution).toContain('OpenStreetMap')
    wrapper.unmount()
  })

  it('requests tiles in Esri row/column order', () => {
    // Esri templates as {z}/{y}/{x}, the reverse of most services. Getting it
    // backwards silently shows the wrong part of the world.
    const wrapper = mountMap()
    const tile = wrapper.element.querySelector('img.leaflet-tile')?.getAttribute('src') ?? ''
    expect(tile).toContain('World_Dark_Gray_Base')
    wrapper.unmount()
  })

  it('keeps implementation wording off the page', () => {
    // Matches the assertions in App.spec.ts: how a figure was obtained is not
    // the viewer's concern.
    const wrapper = mountMap()
    const text = normalisedText(wrapper)
    expect(text).not.toMatch(/snapshot/i)
    expect(text).not.toMatch(/\bquery|queried\b/i)
    expect(text).not.toMatch(/cache/i)
    wrapper.unmount()
  })
})
