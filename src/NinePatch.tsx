import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import { NinePatchCore } from 'ninepatch-core'
import type { NpTcChunkType } from 'ninepatch-core'
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
 * Derive border-image-slice values from parsed chunk data.
 *
 * The vertical insets come from yDivs and the horizontal ones from xDivs,
 * matching the CSS border-image-slice (top right bottom left) order.
 */
function chunkToSlice(chunk: NpTcChunkType): Required<NinePatchBoxEdges> {
  const width = chunk.width ?? 0
  const height = chunk.height ?? 0
  return {
    top: chunk.yDivs.start,
    right: width - chunk.xDivs.stop,
    bottom: height - chunk.yDivs.stop,
    left: chunk.xDivs.start
  }
}

/**
 * Render an Android nine-patch image with CSS `border-image`.
 *
 * - Pass `src` to let the component parse the image with ninepatch-core.
 * - Pass `customOptions` to provide the values manually (parsing is skipped).
 */
export function NinePatch({ src, customOptions, className, style, children }: NinePatchProps) {
  const [chunk, setChunk] = useState<NpTcChunkType | null>(null)

  useEffect(() => {
    // Manual options win; drop any previously parsed data
    if (!src || customOptions) {
      setChunk(null)
      return
    }

    // Guard against races: only the latest src may update the state
    let cancelled = false
    new NinePatchCore(src)
      .getChunkData()
      .then(data => {
        if (!cancelled) setChunk(data)
      })
      .catch(() => {
        if (!cancelled) setChunk(null)
      })

    return () => {
      cancelled = true
    }
  }, [src, customOptions])

  const padding = resolveEdges(customOptions?.padding ?? chunk?.padding)
  const slice = resolveEdges(customOptions?.borderImageSlice ?? (chunk ? chunkToSlice(chunk) : undefined))
  const clipPath = customOptions?.clipPath ?? chunk?.clipPath ?? 0

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
    clipPath: clipPath ? `inset(${clipPath}px)` : undefined,
    ...style
  }

  return (
    <div className={className} style={css}>
      {children}
    </div>
  )
}

export default NinePatch
