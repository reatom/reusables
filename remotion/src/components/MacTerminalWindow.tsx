import React, { ReactNode } from 'react'

interface MacTerminalWindowProps {
  children: ReactNode
  title?: string
}

export const MacTerminalWindow: React.FC<MacTerminalWindowProps> = ({
  children,
  title = 'Terminal',
}) => {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 16,
        overflow: 'hidden',
        boxShadow:
          '0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)',
        backgroundColor: '#ffffff',
      }}
    >
      {/* Title bar */}
      <div
        style={{
          height: 56,
          backgroundColor: '#f6f6f6',
          borderBottom: '1px solid #e0e0e0',
          display: 'flex',
          alignItems: 'center',
          padding: '0 20px',
        }}
      >
        {/* Traffic lights */}
        <div style={{ display: 'flex', gap: 10 }}>
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: '50%',
              backgroundColor: '#ff5f57',
            }}
          />
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: '50%',
              backgroundColor: '#febc2e',
            }}
          />
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: '50%',
              backgroundColor: '#28c840',
            }}
          />
        </div>
        {/* Title */}
        <div style={{ flex: 1, textAlign: 'center' }}>
          <span
            style={{
              color: '#4d4d4d',
              fontSize: 16,
              fontWeight: 500,
              fontFamily: 'system-ui, -apple-system, sans-serif',
            }}
          >
            {title}
          </span>
        </div>
        {/* Spacer for symmetry */}
        <div style={{ width: 64 }} />
      </div>

      {/* Content */}
      <div
        style={{
          flex: 1,
          backgroundColor: '#ffffff',
          overflow: 'hidden',
        }}
      >
        {children}
      </div>
    </div>
  )
}
