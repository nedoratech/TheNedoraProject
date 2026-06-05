import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          background: '#0d0d2b',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        {/* Waveform bars */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 2, height: 24 }}>
          <div style={{ width: 3, height: 10, background: '#7c3aed' }} />
          <div style={{ width: 3, height: 22, background: '#9b5cf6' }} />
          <div style={{ width: 3, height: 14, background: '#7c3aed' }} />
          <div style={{ width: 3, height: 24, background: '#9b5cf6' }} />
          <div style={{ width: 3, height: 12, background: '#7c3aed' }} />
        </div>
        {/* Magenta dot */}
        <div
          style={{
            position: 'absolute',
            top: 4,
            right: 5,
            width: 5,
            height: 5,
            background: '#e91e8c',
            borderRadius: 0,
            transform: 'rotate(45deg)',
          }}
        />
      </div>
    ),
    { ...size },
  )
}
