import { Composition } from 'remotion'
import { VideoNew } from './VideoNew'

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="ReatomPromo"
        component={VideoNew}
        durationInFrames={480}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  )
}
