import type {
  Action,
  AtomLike,
  OverloadParameters,
  Unsubscribe,
} from '@reatom/core'
import {
  isAction,
  isObject,
  noop,
  ReatomError,
  withInitHook,
  wrap,
} from '@reatom/core'

export interface MCPToolAnnotations {
  readOnlyHint?: boolean
}

/**
 * Minimal client object passed by WebMCP to a tool execution callback.
 *
 * @see https://github.com/webmachinelearning/webmcp
 */
export interface MCPModelContextClient {
  requestUserInteraction<Result>(
    callback: () => Result | Promise<Result>,
  ): Promise<Result>
}

export interface MCPModelContextTool<
  Input extends object = Record<string, unknown>,
  Payload = unknown,
> {
  name: string
  description: string
  inputSchema?: object
  execute: (
    input: Input,
    client: MCPModelContextClient,
  ) => Payload | Promise<Payload>
  annotations?: MCPToolAnnotations
}

export interface MCPModelContextOptions {
  tools?: Array<MCPModelContextTool>
}

export interface MCPModelContext {
  provideContext(options?: MCPModelContextOptions): void
  registerTool<
    Input extends object = Record<string, unknown>,
    Payload = unknown,
  >(
    tool: MCPModelContextTool<Input, Payload>,
  ): void
  unregisterTool(name: string): void
}

/**
 * Configuration for `withMCP`.
 *
 * @template Target - Atom or action being exposed as a WebMCP tool
 * @template Input - Tool input object expected from an agent
 */
export interface WithMCPOptions<
  Target extends AtomLike,
  Input extends object = Record<string, unknown>,
> {
  name?: string
  /**
   * Optional natural language description for agent planning.
   *
   * Defaults to a generated generic description with the target name.
   */
  description?: string
  /**
   * Optional JSON Schema for the tool input.
   *
   * Agents rely on this schema to build valid calls, choose appropriate tools,
   * and reduce malformed arguments. In practice, this is one of the most
   * important fields for predictable tool execution.
   */
  inputSchema?: object
  annotations?: MCPToolAnnotations
  /**
   * Optional static `modelContext` override.
   *
   * When omitted, registration tries `navigator.modelContext`.
   */
  modelContext?: MCPModelContext
  /**
   * Whether to register the action tool immediately during extension
   * application.
   *
   * Default is `false`. This option applies to actions only.
   */
  autoRegister?: boolean
  /**
   * Optional input-to-target args mapper. Applies to actions only.
   *
   * Defaults to calling the action with `input` as the first argument. Use this
   * to remap a tool input object to multi-argument actions. Ignored for atoms,
   * which always read current state via `target()`.
   */
  params?: (
    input: Input,
    client: MCPModelContextClient,
    target: Target,
  ) => OverloadParameters<Target>
}

export interface RegisterMCPOptions {
  modelContext?: MCPModelContext
}

/** Extension methods added by `withMCP` on actions. */
export interface MCPExt {
  /**
   * Register a WebMCP tool for this action and return a cleanup callback.
   *
   * Duplicate registration is the caller's responsibility — the underlying
   * `modelContext.registerTool` will throw if the same tool name is registered
   * twice without an intermediate `unregisterTool`.
   */
  registerMCP: (options?: RegisterMCPOptions) => Unsubscribe
}

export interface WithMCPExt<Target extends AtomLike = AtomLike> {
  <T extends Target>(target: T): T extends Action ? MCPExt : T
}

const isMCPModelContext = (
  candidate: unknown,
): candidate is MCPModelContext => {
  if (!isObject(candidate)) return false
  return (
    typeof Reflect.get(candidate, 'provideContext') === 'function' &&
    typeof Reflect.get(candidate, 'registerTool') === 'function' &&
    typeof Reflect.get(candidate, 'unregisterTool') === 'function'
  )
}

/**
 * Detects `navigator.modelContext` when available in a WebMCP-enabled browser.
 *
 * @see https://github.com/webmachinelearning/webmcp
 */
export const getMCPModelContext = (): undefined | MCPModelContext => {
  if (typeof navigator === 'undefined') return undefined
  const candidate = Reflect.get(navigator, 'modelContext')
  return isMCPModelContext(candidate) ? candidate : undefined
}

const DEFAULT_DESCRIPTION_PREFIX = 'Use this tool to interact with'
const getDefaultDescription = (target: AtomLike): string =>
  `${DEFAULT_DESCRIPTION_PREFIX} "${target.name}".`

/**
 * Extend atoms and actions with WebMCP tool registration.
 *
 * This extension maps Reatom entities to the [WebMCP proposal]
 * (https://github.com/webmachinelearning/webmcp) shape
 * (`navigator.modelContext.registerTool`) so browser AI agents can invoke
 * application behavior through typed tools.
 *
 * ## Actions
 *
 * Actions represent **executable behavior**. The extension adds a
 * `registerMCP()` method that registers the tool and returns a cleanup
 * function. Call `registerMCP` at the appropriate scope of the app:
 *
 * - Runtime: in the root route or layout
 * - Tests: at test start, clean up with the returned unsubscribe
 *
 * By default the input object is forwarded as the first argument. Use `params`
 * to remap it.
 *
 * ## Atoms
 *
 * Atoms represent **readable state snapshots**. No `registerMCP` method is
 * added; instead the tool is registered automatically when the atom is first
 * initialized (via `withInitHook`). This registration is page-level — there is
 * no teardown path because `withInitHook` does not provide a cleanup
 * mechanism.
 *
 * ## Reactive context
 *
 * Tool callbacks are wrapped at registration time with Reatom's `wrap`, so
 * agent calls run inside the reactive context captured at registration scope.
 *
 * @example
 *   // Marketplace: goods list atom with explicit MCP options.
 *   const goodsAtom = atom(
 *     [{ id: 'sku-1', title: 'Laptop', price: 1200 }],
 *     'marketplace.goods',
 *   ).extend(
 *     withMCP({
 *       name: 'list-goods',
 *       description: 'List currently available goods in the marketplace.',
 *       annotations: { readOnlyHint: true },
 *     }),
 *   )
 *   // Registered automatically on first read.
 *   goodsAtom()
 *
 * @example
 *   // Marketplace: search query atom with no explicit options.
 *   const searchAtom = atom('', 'marketplace.search').extend(withMCP({}))
 *   // Registered automatically on first read.
 *   searchAtom()
 *
 * @example
 *   // Marketplace: addToCard action with description and inputSchema.
 *   const cartAtom = atom<Array<{ goodsId: string; quantity: number }>>(
 *     [],
 *     'cart',
 *   )
 *   const addToCard = action(
 *     (input: { goodsId: string; quantity: number }) => {
 *       cartAtom.set((state) => [...state, input])
 *       return { ok: true }
 *     },
 *     'addToCard',
 *   ).extend(
 *     withMCP({
 *       description: 'Add a goods item to the shopping cart.',
 *       inputSchema: {
 *         type: 'object',
 *         properties: {
 *           goodsId: { type: 'string' },
 *           quantity: { type: 'number', minimum: 1 },
 *         },
 *         required: ['goodsId', 'quantity'],
 *       },
 *     }),
 *   )
 *
 *   // Register in root layout / route:
 *   const unregister = addToCard.registerMCP()
 *   // Cleanup on unmount:
 *   unregister()
 *
 * @see https://github.com/webmachinelearning/webmcp
 * @see https://modelcontextprotocol.io/specification/latest
 */
export function withMCP<
  Target extends AtomLike = AtomLike,
  Input extends object = Record<string, unknown>,
>(options: WithMCPOptions<Target, Input>): WithMCPExt<Target> {
  return (<T extends Target>(target: T) => {
    const {
      name = target.name,
      description,
      inputSchema,
      annotations,
      modelContext,
      autoRegister = false,
      params,
    } = options

    if (description !== undefined && typeof description !== 'string') {
      throw new ReatomError('withMCP: `description` should be a string')
    }

    if (params !== undefined && typeof params !== 'function') {
      throw new ReatomError('withMCP: `params` should be a function')
    }

    const resolveModelContext = (): undefined | MCPModelContext =>
      modelContext ?? getMCPModelContext()

    const toolDescription = description ?? getDefaultDescription(target)
    const toolName = name

    const registerTool = (registrationModelContext: MCPModelContext) => {
      const execute = wrap((input: Input, client: MCPModelContextClient) => {
        if (isAction(target)) {
          if (params) return target(...params(input, client, target))
          return target(input)
        }
        return target()
      })

      registrationModelContext.registerTool({
        name: toolName,
        description: toolDescription,
        inputSchema,
        execute,
        annotations,
      } satisfies MCPModelContextTool<Input, Awaited<ReturnType<Target>>>)

      return () => registrationModelContext.unregisterTool(toolName)
    }

    if (isAction(target)) {
      const registerMCP = (
        registrationOptions: RegisterMCPOptions = {},
      ): Unsubscribe => {
        const ctx = registrationOptions.modelContext ?? resolveModelContext()
        if (ctx === undefined) return noop
        return registerTool(ctx)
      }

      if (autoRegister) registerMCP()

      // Intentional cast: T extends Action discriminates MCPExt vs. atom passthrough
      return { registerMCP } as T extends Action ? MCPExt : T
    }

    return target.extend(
      withInitHook(() => {
        const ctx = resolveModelContext()
        if (ctx === undefined) return
        registerTool(ctx)
      }),
      // Intentional cast: atom targets pass through; T extends Action is false here
    ) as T extends Action ? MCPExt : T
  }) as WithMCPExt<Target>
}
