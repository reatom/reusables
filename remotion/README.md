# Reatom reusables promo

Remotion composition for the registry promo. Uses the same pnpm workspace and
React version as the site. Run commands from the repository root with Node
26.13.0 and pnpm 12.18.0, or use `mise exec --` before a command.

```sh
pnpm install --frozen-lockfile
pnpm video:dev
pnpm video:build
```

The studio opens at http://localhost:3000. The build renders `ReatomPromo` to
`.var/remotion/promo.mp4` at 1920×1080, 30 fps, for 16 seconds.

Edit `src/VideoNew.tsx` for scenes and timing, `src/Root.tsx` for composition
settings, and `src/styles/colors.ts` for colors. Encoding settings live in
`.config/remotion.config.ts`.

Run `pnpm --filter reatom-reusables-promo typecheck` to check the video code.
Update `remotion` and `@remotion/cli` together to the same exact version.

See the [Remotion docs](https://www.remotion.dev/docs/) for rendering options.
