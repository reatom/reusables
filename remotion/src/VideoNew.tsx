import React from 'react'
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
} from 'remotion'
import { colors } from './styles/colors'
import { MacTerminalWindow } from './components/MacTerminalWindow'
import { TerminalWithOutput } from './components/TerminalWithOutput'

// Scene 1: Opening - Brand reveal with impact
const OpeningScene: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // Main title entrance with powerful spring
  const entrance = spring({
    frame,
    fps,
    config: {
      damping: 80,
      stiffness: 120,
    },
  })

  const titleOpacity = interpolate(entrance, [0, 1], [0, 1])
  const titleScale = interpolate(entrance, [0, 1], [0.5, 1])

  // Subtitle delayed entrance
  const subtitleSpring = spring({
    frame: frame - 15,
    fps,
    config: { damping: 100 },
  })

  const subtitleOpacity = interpolate(subtitleSpring, [0, 1], [0, 1])
  const subtitleY = interpolate(subtitleSpring, [0, 1], [40, 0])

  // Dynamic glow pulse
  const glowIntensity = interpolate(
    Math.sin((frame / fps) * Math.PI * 2),
    [-1, 1],
    [0.5, 1],
  )

  // Particle effect
  const particleRotation = frame * 0.2

  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '4vw',
      }}
    >
      {/* Animated background particles */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          opacity: 0.15,
          transform: `rotate(${particleRotation}deg)`,
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '20%',
            left: '20%',
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${colors.glow} 0%, transparent 70%)`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '30%',
            right: '25%',
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${colors.glowBlue} 0%, transparent 70%)`,
          }}
        />
      </div>

      {/* Main title */}
      <h1
        style={{
          fontSize: 'clamp(70px, 9vw, 160px)',
          fontWeight: 'bold',
          color: colors.primary,
          fontFamily: 'system-ui, -apple-system, sans-serif',
          margin: 0,
          opacity: titleOpacity,
          transform: `scale(${titleScale})`,
          textShadow: `0 0 ${60 * glowIntensity}px ${colors.glow},
                       0 0 ${120 * glowIntensity}px ${colors.glow}`,
          letterSpacing: '-0.03em',
          textAlign: 'center',
          lineHeight: 1.1,
        }}
      >
        @reatom/reusables
      </h1>

      {/* Subtitle */}
      <p
        style={{
          fontSize: 'clamp(26px, 3.5vw, 64px)',
          color: colors.textSecondary,
          fontFamily: 'system-ui, -apple-system, sans-serif',
          margin: '3vh 0 0 0',
          opacity: subtitleOpacity,
          transform: `translateY(${subtitleY}px)`,
          textAlign: 'center',
          fontWeight: 500,
          maxWidth: '80%',
        }}
      >
        Reusable state management patterns
        <br />
        <span style={{ color: colors.primary }}>shadcn/ui</span> style
      </p>
    </AbsoluteFill>
  )
}

// Scene 2: Terminal installation with 3D effects
const InstallationScene: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // Title entrance
  const titleSpring = spring({
    frame,
    fps,
    config: { damping: 100 },
  })

  const titleOpacity = interpolate(titleSpring, [0, 1], [0, 1])
  const titleY = interpolate(titleSpring, [0, 1], [-50, 0])

  // Terminal flies in from bottom with 3D rotation
  const terminalSpring = spring({
    frame: frame - 15,
    fps,
    config: {
      damping: 150,
      stiffness: 100,
    },
  })

  const terminalY = interpolate(terminalSpring, [0, 1], [800, 0])
  const terminalRotateX = interpolate(terminalSpring, [0, 1], [30, 12])
  const terminalScale = interpolate(terminalSpring, [0, 1], [0.85, 1])

  // Continuous subtle rotation
  const rotateY = interpolate(frame, [0, 120], [8, -8], {
    extrapolateRight: 'clamp',
  })

  const output = [
    '',
    '◇  Retrieved manifest from github.com/reatom/reusables',
    '◇  Configure paths → src/reatom',
    '◆  Wrote config to jsrepo.config.ts',
    '◆  Updated paths',
    '└  Initialization complete!',
  ]

  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '4vw',
        perspective: 1500,
      }}
    >
      {/* Title */}
      <div
        style={{
          marginBottom: '5vh',
          width: '100%',
          maxWidth: '1600px',
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
        }}
      >
        <h2
          style={{
            fontSize: 'clamp(36px, 4.5vw, 80px)',
            color: colors.primary,
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontWeight: 700,
            textAlign: 'center',
            margin: 0,
            textShadow: `0 0 30px ${colors.glow}`,
          }}
        >
          Get Started in Seconds
        </h2>
      </div>

      {/* Terminal with 3D transform */}
      <div
        style={{
          width: '90%',
          maxWidth: '1400px',
          height: '55%',
          transform: `translateY(${terminalY}px)
                      rotateX(${terminalRotateX}deg)
                      rotateY(${rotateY}deg)
                      scale(${terminalScale})`,
          transformStyle: 'preserve-3d',
        }}
      >
        <MacTerminalWindow title="Terminal — bash">
          <TerminalWithOutput
            command="npx jsrepo init github/reatom/reusables"
            output={output}
            commandDuration={40}
            outputDelay={8}
            outputLineDelay={4}
          />
        </MacTerminalWindow>
      </div>
    </AbsoluteFill>
  )
}

// Scene 3: Add utility with code reveal
const AddUtilityScene: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // Title entrance
  const titleSpring = spring({
    frame,
    fps,
    config: { damping: 100 },
  })

  const titleOpacity = interpolate(titleSpring, [0, 1], [0, 1])

  // Terminal entrance with 3D
  const terminalSpring = spring({
    frame: frame - 12,
    fps,
    config: {
      damping: 150,
      stiffness: 100,
    },
  })

  const terminalY = interpolate(terminalSpring, [0, 1], [600, 0])
  const terminalRotateX = interpolate(terminalSpring, [0, 1], [25, 12])
  const terminalScale = interpolate(terminalSpring, [0, 1], [0.85, 1])

  const rotateY = interpolate(frame, [0, 150], [8, -8], {
    extrapolateRight: 'clamp',
  })

  // Code box entrance
  const codeSpring = spring({
    frame: frame - 70,
    fps,
    config: { damping: 100 },
  })

  const codeOpacity = interpolate(codeSpring, [0, 1], [0, 1])
  const codeScale = interpolate(codeSpring, [0, 1], [0.9, 1])
  const codeY = interpolate(codeSpring, [0, 1], [50, 0])

  const output = [
    '◇  Retrieved manifest from https://github.com/reatom/reusables',
    '◇  Fetched withHistory',
    '└  Added to your project. Updated 1 file.',
  ]

  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '3vw',
        gap: '3vh',
        perspective: 1500,
      }}
    >
      {/* Title */}
      <div
        style={{
          width: '90%',
          maxWidth: '1500px',
          opacity: titleOpacity,
        }}
      >
        <h2
          style={{
            fontSize: 'clamp(36px, 4.5vw, 80px)',
            color: colors.primary,
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontWeight: 700,
            textAlign: 'center',
            margin: 0,
            textShadow: `0 0 30px ${colors.glow}`,
          }}
        >
          Add Any Pattern Instantly
        </h2>
      </div>

      {/* Terminal */}
      <div
        style={{
          width: '88%',
          maxWidth: '1400px',
          height: '32%',
          transform: `translateY(${terminalY}px)
                      rotateX(${terminalRotateX}deg)
                      rotateY(${rotateY}deg)
                      scale(${terminalScale})`,
          transformStyle: 'preserve-3d',
        }}
      >
        <MacTerminalWindow title="Terminal — bash">
          <TerminalWithOutput
            command="npx jsrepo add withHistory"
            output={output}
            commandDuration={35}
            outputDelay={8}
            outputLineDelay={4}
          />
        </MacTerminalWindow>
      </div>

      {/* Code snippet */}
      <div
        style={{
          width: '88%',
          maxWidth: '1400px',
          opacity: codeOpacity,
          transform: `translateY(${codeY}px) scale(${codeScale})`,
        }}
      >
        <div
          style={{
            backgroundColor: colors.terminalBg,
            borderRadius: 20,
            padding: '2.5vw',
            border: `2px solid ${colors.terminalBorder}`,
            boxShadow: `0 12px 40px rgba(0, 0, 0, 0.7),
                        0 0 30px ${colors.glowBlue}`,
          }}
        >
          <pre
            style={{
              fontFamily: '"Fira Code", Monaco, monospace',
              fontSize: 'clamp(20px, 2.5vw, 42px)',
              color: colors.accent,
              margin: 0,
              lineHeight: 1.6,
              textShadow: `0 0 10px ${colors.glowBlue}`,
            }}
          >
            {`import { withHistory } from '#reatom/with-history'

const counterAtom = atom(0, 'counter')
  .extend(withHistory())

counter.set(1)
counter.set(2)
counter.history() // [2, 1, 0]`}
          </pre>
        </div>
      </div>
    </AbsoluteFill>
  )
}

// Scene 4: Closing with impact
const ClosingScene: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // Main message entrance
  const messageSpring = spring({
    frame,
    fps,
    config: {
      damping: 90,
      stiffness: 110,
    },
  })

  const messageOpacity = interpolate(messageSpring, [0, 1], [0, 1])
  const messageScale = interpolate(messageSpring, [0, 1], [0.7, 1])

  // URL entrance
  const urlSpring = spring({
    frame: frame - 25,
    fps,
    config: { damping: 100 },
  })

  const urlOpacity = interpolate(urlSpring, [0, 1], [0, 1])
  const urlY = interpolate(urlSpring, [0, 1], [40, 0])

  // Pulsing glow
  const glow = interpolate(
    Math.sin((frame / fps) * Math.PI * 1.8),
    [-1, 1],
    [0.6, 1],
  )

  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '4vw',
        gap: '7vh',
      }}
    >
      {/* Background glow effect */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          opacity: 0.25,
          background: `radial-gradient(circle at 50% 45%, ${colors.glow} 0%, transparent 55%)`,
        }}
      />

      {/* Main tagline */}
      <h1
        style={{
          fontSize: 'clamp(50px, 7vw, 130px)',
          fontWeight: 'bold',
          color: colors.primary,
          fontFamily: 'system-ui, -apple-system, sans-serif',
          margin: 0,
          opacity: messageOpacity,
          transform: `scale(${messageScale})`,
          textShadow: `0 0 ${50 * glow}px ${colors.glow},
                       0 0 ${100 * glow}px ${colors.glow}`,
          textAlign: 'center',
          letterSpacing: '-0.03em',
          lineHeight: 1.2,
          maxWidth: '90%',
        }}
      >
        Own Your
        <br />
        State Management
      </h1>

      {/* GitHub URL */}
      <div
        style={{
          opacity: urlOpacity,
          transform: `translateY(${urlY}px)`,
        }}
      >
        <div
          style={{
            fontSize: 'clamp(30px, 4.2vw, 72px)',
            color: colors.textSecondary,
            fontFamily: '"Fira Code", Monaco, monospace',
            textShadow: `0 0 25px ${colors.glowBlue}`,
            fontWeight: 600,
            textAlign: 'center',
          }}
        >
          github.com/reatom/reusables
        </div>
      </div>

      {/* Decorative element */}
      <div
        style={{
          marginTop: '2vh',
          fontSize: 'clamp(22px, 2.8vw, 48px)',
          color: colors.primary,
          opacity: urlOpacity * 0.7,
        }}
      >
        ✨
      </div>
    </AbsoluteFill>
  )
}

// Main video composition
export const VideoNew: React.FC = () => {
  // Scene timings (30fps)
  const openingDuration = 90 // 3s
  const installDuration = 120 // 4s
  const addDuration = 150 // 5s
  const closingDuration = 120 // 4s

  const installStart = openingDuration
  const addStart = installStart + installDuration
  const closingStart = addStart + addDuration

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg,
          ${colors.gradientStart} 0%,
          ${colors.gradientEnd} 50%,
          ${colors.gradientStart} 100%)`,
      }}
    >
      {/* Global background pattern */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          backgroundImage: `radial-gradient(circle at 25% 25%, ${colors.glow} 0%, transparent 45%),
                            radial-gradient(circle at 75% 75%, ${colors.glowBlue} 0%, transparent 45%)`,
          opacity: 0.12,
        }}
      />

      {/* Scene 1: Opening */}
      <Sequence from={0} durationInFrames={openingDuration}>
        <OpeningScene />
      </Sequence>

      {/* Scene 2: Installation */}
      <Sequence from={installStart} durationInFrames={installDuration}>
        <InstallationScene />
      </Sequence>

      {/* Scene 3: Add Utility */}
      <Sequence from={addStart} durationInFrames={addDuration}>
        <AddUtilityScene />
      </Sequence>

      {/* Scene 4: Closing */}
      <Sequence from={closingStart} durationInFrames={closingDuration}>
        <ClosingScene />
      </Sequence>
    </AbsoluteFill>
  )
}
