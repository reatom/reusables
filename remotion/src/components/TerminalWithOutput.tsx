import React from 'react'
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion'

interface TerminalWithOutputProps {
  command: string
  output?: string[]
  commandDuration?: number
  outputDelay?: number
  outputLineDelay?: number
  showPrompt?: boolean
}

export const TerminalWithOutput: React.FC<TerminalWithOutputProps> = ({
  command,
  output = [],
  commandDuration = 60,
  outputDelay = 15,
  outputLineDelay = 3,
  showPrompt = true,
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // Cursor blink animation
  const cursorOpacity = Math.floor((frame / 15) % 2) === 0 ? 1 : 0.3

  // Typewriter effect - calculate visible characters
  const typingProgress = interpolate(frame, [0, commandDuration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const charsToShow = Math.floor(typingProgress * command.length)
  const displayedText = command.slice(0, charsToShow)
  const isTypingComplete = typingProgress >= 1

  // Output animation
  const outputStartFrame = commandDuration + outputDelay
  const showOutput = frame >= outputStartFrame

  // Calculate how many output lines to show
  const visibleLines = showOutput
    ? Math.min(
        Math.floor((frame - outputStartFrame) / outputLineDelay),
        output.length
      )
    : 0

  return (
    <div
      style={{
        padding: '2.5vw',
        fontFamily: '"Fira Code", "Courier New", monospace',
        fontSize: 'clamp(20px, 2.2vw, 44px)',
        color: '#333',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5em',
        height: '100%',
      }}
    >
      {/* Command line */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {showPrompt && (
          <span
            style={{
              color: '#2ecc71',
              marginRight: 12,
              fontWeight: 600,
            }}
          >
            $
          </span>
        )}
        <span style={{ color: '#333' }}>{displayedText}</span>
        {!showOutput && (
          <span
            style={{
              marginLeft: 4,
              opacity: isTypingComplete ? cursorOpacity : 1,
              color: '#333',
            }}
          >
            ▊
          </span>
        )}
      </div>

      {/* Output lines */}
      {showOutput && (
        <div style={{ paddingLeft: showPrompt ? '1.5em' : 0 }}>
          {output.slice(0, visibleLines).map((line, i) => (
            <div
              key={i}
              style={{
                color: '#666',
                fontSize: '0.9em',
                lineHeight: 1.6,
              }}
            >
              {line}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
