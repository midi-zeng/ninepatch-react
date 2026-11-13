import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import { NinePatchCore } from 'ninepatch-core'
import type { NinePatchData } from 'ninepatch-core'
import type { NinePatchBoxEdges, NinePatchProps } from './types'

const DEFAULT_EDGES: Required<NinePatchBoxEdges> = { top: 0, right: 0, bottom: 0, left: 0 }

function resolveEdges(edges: NinePatchBoxEdges | undefined): Required<NinePatchBoxEdges> {
  return { ...DEFAULT_EDGES, ...edges }
}

function edgesToCss(edges: Required<NinePatchBoxEdges>, unit: 'px' | ''): string {
  const suffix = unit === 'px' ? 'px' : ''
  return `${edges.top}${suffix} ${edges.right}${suffix} ${edges.bottom}${suffix} ${edges.left}${suffix}`
}

/**
 * Derive border-image-slice values from parsed render data.
 *
 * The vertical insets come from yDivs and the horizontal ones from xDivs,
 * matching the CSS border-image-slice (top right bottom left) order.
 */
function renderDataToSlice(data: NinePatchData): Required<NinePatchBoxEdges> {
  const width = data.width ?? 0
  const height = data.height ?? 0
  return {
    top: data.yDivs.start,
    right: width - data.xDivs.stop,
    bottom: height - data.yDivs.stop,
    left: data.xDivs.start
  }
}

/**
 * Render an Android nine-patch image with CSS `border-image`.
 *
 * - Pass `src` to let the component parse the image with ninepatch-core.
 * - Pass `customOptions` to provide the values manually (parsing is skipped).
 */
export function NinePatch({ src, customOptions, className, style, children }: NinePatchProps) {
  const [renderData, setRenderData] = useState<NinePatchData | null>(null)

  useEffect(() => {
    // Manual options win; drop any previously parsed data
    if (!src || customOptions) {
      setRenderData(null)
      return
    }

    // Guard against races: only the latest src may update the state
    let cancelled = false
    new NinePatchCore(src)
      .getRenderData()
      .then(data => {
        if (!cancelled) setRenderData(data)
      })
      .catch(() => {
        if (!cancelled) setRenderData(null)
      })

    return () => {
      cancelled = true
    }
  }, [src, customOptions])

  const padding = resolveEdges(customOptions?.padding ?? renderData?.padding)
  const slice = resolveEdges(customOptions?.borderImageSlice ?? (renderData ? renderDataToSlice(renderData) : undefined))
  const borderInset = customOptions?.borderInset ?? renderData?.borderInset ?? 0

  const css: CSSProperties = {
    height: '100%',
    borderImageSource: src ? `url(${src})` : undefined,
    borderImageSlice: `${edgesToCss(slice, '')} fill`,
    borderImageWidth: edgesToCss(slice, 'px'),
    // Longhands avoid lossy shorthand normalization for partial values
    paddingTop: padding.top,
    paddingRight: padding.right,
    paddingBottom: padding.bottom,
    paddingLeft: padding.left,
    clipPath: borderInset ? `inset(${borderInset}px)` : undefined,
    ...style
  }

  return (
    <div className={className} style={css}>
      {children}
    </div>
  )
}

export default NinePatch
