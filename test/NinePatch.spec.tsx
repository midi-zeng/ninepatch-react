import { render, waitFor } from '@testing-library/react'
import { describe, expect, test, vi } from 'vitest'
import { NinePatch } from '../src/NinePatch'

const { getRenderData } = vi.hoisted(() => ({
  // Never resolves by default so tests that parse must set an explicit result
  getRenderData: vi.fn(() => new Promise(() => {}))
}))

vi.mock('ninepatch-core', () => ({
  NinePatchCore: class {
    constructor(public src: string) {}
    getRenderData = getRenderData
  }
}))

const GOLDEN_RENDER_DATA = {
  padding: { left: 10, right: 20, top: 10, bottom: 20 },
  xDivs: { start: 14, stop: 29 },
  yDivs: { start: 14, stop: 29 },
  xDivsList: [{ start: 14, stop: 29 }],
  yDivsList: [{ start: 14, stop: 29 }],
  width: 180,
  height: 120
}

describe('NinePatch', () => {
  test('renders children', () => {
    const { getByText } = render(<NinePatch src="/btn.png">hello</NinePatch>)
    expect(getByText('hello')).toBeTruthy()
  })

  test('applies parsed chunk data as border-image styles', async () => {
    getRenderData.mockResolvedValue(GOLDEN_RENDER_DATA)

    const { container } = render(<NinePatch src="/btn.png">x</NinePatch>)
    const el = container.firstElementChild as HTMLElement

    await waitFor(() => expect(el.style.borderImageSource).toContain('/btn.png'))
    expect(el.style.borderImageSlice).toBe('14 151 91 14 fill')
    expect(el.style.borderImageWidth).toBe('14px 151px 91px 14px')
    expect(el.style.paddingTop).toBe('10px')
    expect(el.style.paddingRight).toBe('20px')
    expect(el.style.paddingBottom).toBe('20px')
    expect(el.style.paddingLeft).toBe('10px')
  })

  test('custom options skip image parsing entirely', () => {
    getRenderData.mockClear()

    const { container } = render(
      <NinePatch
        src="/btn.png"
        customOptions={{ padding: { top: 5 }, borderImageSlice: { left: 2, right: 3 }, borderInset: 1 }}
      >
        x
      </NinePatch>
    )
    const el = container.firstElementChild as HTMLElement

    expect(getRenderData).not.toHaveBeenCalled()
    expect(el.style.paddingTop).toBe('5px')
    expect(el.style.paddingRight).toBe('0px')
    expect(el.style.borderImageSlice).toBe('0 3 0 2 fill')
    expect(el.style.clipPath).toBe('inset(1px)')
  })

  test('custom options drop previously parsed chunk data', async () => {
    getRenderData.mockResolvedValue(GOLDEN_RENDER_DATA)

    const { container, rerender } = render(<NinePatch src="/btn.png">x</NinePatch>)
    await waitFor(() => expect(getRenderData).toHaveBeenCalled())

    rerender(<NinePatch src="/btn.png" customOptions={{ padding: { left: 7 } }}>
      x
    </NinePatch>)
    const el = container.firstElementChild as HTMLElement

    expect(el.style.paddingLeft).toBe('7px')
    expect(el.style.borderImageSlice).not.toContain('14')
  })

  test('ignores stale responses after src changes', async () => {
    let resolveA: (value: unknown) => void = () => {}
    getRenderData.mockImplementation(function (this: { src: string }) {
      if (this.src === '/a.png') {
        return new Promise(resolve => {
          resolveA = resolve
        })
      }
      return Promise.resolve({ ...GOLDEN_RENDER_DATA, borderInset: 9 })
    })

    const { container, rerender } = render(<NinePatch src="/a.png">x</NinePatch>)
    rerender(<NinePatch src="/b.png">x</NinePatch>)
    await waitFor(() => expect((container.firstElementChild as HTMLElement).style.clipPath).toBe('inset(9px)'))

    resolveA({ ...GOLDEN_RENDER_DATA, borderInset: 1 })
    await new Promise(resolve => setTimeout(resolve, 0))

    // the late response for /a.png must not overwrite /b.png
    expect((container.firstElementChild as HTMLElement).style.clipPath).toBe('inset(9px)')
  })

  test('parse failures render without border-image data', async () => {
    getRenderData.mockRejectedValue(new Error('network down'))

    const { container } = render(<NinePatch src="/broken.png">x</NinePatch>)
    await waitFor(() => {
      const el = container.firstElementChild as HTMLElement
      expect(el.style.paddingTop).toBe('0px')
    })
  })

  test('merges user style and className', () => {
    const { container } = render(
      <NinePatch src="/btn.png" className="custom" style={{ height: '50px' }}>
        x
      </NinePatch>
    )
    const el = container.firstElementChild as HTMLElement

    expect(el.className).toBe('custom')
    expect(el.style.height).toBe('50px')
  })
})
