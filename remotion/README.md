# Reatom Reusables Promo Video

This directory contains the Remotion project for creating a 10-15 second promotional video for the Reatom reusables jsrepo registry.

## Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

This will open the Remotion Studio at http://localhost:3000 where you can preview the video in real-time.

## Available Scripts

- `npm run dev` - Start Remotion Studio for development and preview
- `npm run build:landscape` - Render video at 1920x1080 (for YouTube/Twitter)
- `npm run build` - Render default video at 1920x1080
- `npm run upgrade` - Upgrade Remotion to the latest version

## Rendering Videos

To render the final video output:

### Landscape Format (YouTube/Twitter)

```bash
npm run build:landscape
```

Output: `out/promo-landscape.mp4` (1920x1080)

## Customizing the Video

### Changing Text Content

Edit the scene files in `src/scenes/`:

- `IntroScene.tsx` - Opening title text
- `InstallScene.tsx` - Terminal command for initialization
- `AddScene.tsx` - Terminal command for adding extensions
- `OutroScene.tsx` - Closing tagline and URL

### Adjusting Colors and Branding

Edit `src/styles/colors.ts` to change:

- `primary` - Main brand color (vibrant purple)
- `primaryDark` - Deep purple shade
- `primaryLight` - Light purple shade
- `accent` - Highlight color (blue)
- `accentBright` - Light blue accent
- `terminalBg` - Terminal background color
- `terminalBorder` - Terminal border color
- `terminalText` - Terminal text color (green)
- `terminalPrompt` - Terminal prompt color (gray)
- `gradientStart` / `gradientEnd` - Background gradient colors
- `textPrimary` / `textSecondary` - General text colors
- `glow` - Purple glow effect
- `glowBlue` - Blue glow effect

### Modifying Timing

Edit `src/Video.tsx` to adjust scene durations:

- IntroScene: 0-3 seconds
- InstallScene: 3-6 seconds
- AddScene: 6-11 seconds
- OutroScene: 11-15 seconds

Change the `from` and `durationInFrames` props in the `<Sequence>` components.

### Animation Speed

Animations use Remotion's `spring()` and `interpolate()` functions. To adjust animation speed:

1. Edit the `config` parameter in `spring()` calls
2. Modify the `inputRange` and `outputRange` in `interpolate()` calls
3. Adjust frame numbers in timing calculations

## Project Structure

```
remotion/
├── src/
│   ├── components/
│   │   ├── Terminal.tsx       # Terminal display component
│   │   └── TypewriterText.tsx # Text typing animation
│   ├── scenes/
│   │   ├── IntroScene.tsx     # Opening scene
│   │   ├── InstallScene.tsx   # jsrepo init command
│   │   ├── AddScene.tsx       # jsrepo add command
│   │   └── OutroScene.tsx     # Closing scene
│   ├── styles/
│   │   └── colors.ts          # Brand color palette
│   ├── Video.tsx              # Main composition
│   ├── Root.tsx               # Composition registry
│   └── index.ts               # Entry point
├── out/                       # Rendered video output
├── package.json
├── remotion.config.ts         # Remotion configuration
└── tsconfig.json
```

## Video Specifications

- Duration: 15 seconds
- Frame rate: 30 fps
- Total frames: 450
- Codec: H.264 (MP4)
- Resolution: 1920x1080 (16:9)

## Troubleshooting

### Studio won't start

Make sure all dependencies are installed:

```bash
rm -rf node_modules package-lock.json
npm install
```

### Render fails

Check that the output directory exists:

```bash
mkdir -p out
```

### Video quality issues

Adjust the codec settings in `remotion.config.ts`:

- Increase `crf` value for smaller file size (lower quality)
- Decrease `crf` value for better quality (larger file size)

## Resources

- [Remotion Documentation](https://www.remotion.dev/docs/)
- [Remotion API Reference](https://www.remotion.dev/docs/api)
- [Reatom Documentation](https://reatom.dev)
