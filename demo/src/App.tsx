import { useState } from 'react'
import { NinePatch } from 'ninepatch-react'

const IMAGES = {
  raw: '/btn.9.png',
  compiled: '/btn.compiled.9.png'
}

export default function App() {
  const [width, setWidth] = useState(400)

  return (
    <div className="min-h-screen bg-slate-100 p-8 font-sans text-slate-800">
      <h1 className="mb-1 text-2xl font-bold">ninepatch-react demo</h1>
      <p className="mb-6 text-sm text-slate-500">
        Android nine-patch images rendered with CSS border-image (React 19 + Vite + UnoCSS)
      </p>

      <label className="mb-6 flex items-center gap-3 text-sm">
        <span className="w-28">Width: {width}px</span>
        <input
          type="range"
          min={180}
          max={800}
          value={width}
          onChange={event => setWidth(Number(event.target.value))}
          className="w-64"
        />
      </label>

      <div className="flex flex-wrap gap-8">
        <section>
          <h2 className="mb-2 text-sm font-semibold text-slate-600">Raw source (guide border kept, clipPath 1)</h2>
          <div style={{ width, height: Math.round((width * 122) / 182) }}>
            <NinePatch src={IMAGES.raw}>
              <div className="flex h-full items-center justify-center text-sm">Raw nine-patch</div>
            </NinePatch>
          </div>
        </section>

        <section>
          <h2 className="mb-2 text-sm font-semibold text-slate-600">AAPT-compiled (npTc chunk)</h2>
          <div style={{ width, height: Math.round((width * 120) / 180) }}>
            <NinePatch src={IMAGES.compiled}>
              <div className="flex h-full items-center justify-center text-sm">Compiled nine-patch</div>
            </NinePatch>
          </div>
        </section>
      </div>
    </div>
  )
}
