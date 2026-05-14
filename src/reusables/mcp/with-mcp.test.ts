import { action, atom } from '@reatom/core'
import type { Unsubscribe } from '@reatom/core'
import { describe, expect, expectTypeOf, test, vi } from 'test'
import type {
  MCPModelContext,
  MCPModelContextClient,
  MCPModelContextTool,
} from './with-mcp'
import { withMCP } from './with-mcp'

const client: MCPModelContextClient = {
  requestUserInteraction: async (callback) => callback(),
}

const createModelContext = () => {
  const tools = new Map<string, MCPModelContextTool>()
  const modelContext: MCPModelContext = {
    provideContext(options = {}) {
      tools.clear()
      for (const tool of options.tools ?? []) tools.set(tool.name, tool)
    },
    registerTool(tool) {
      if (tools.has(tool.name)) {
        throw new Error(`Tool "${tool.name}" is already registered`)
      }
      tools.set(tool.name, tool)
    },
    unregisterTool(name) {
      tools.delete(name)
    },
  }
  return {
    modelContext,
    tools,
    registerToolSpy: vi.spyOn(modelContext, 'registerTool'),
    unregisterToolSpy: vi.spyOn(modelContext, 'unregisterTool'),
  }
}

describe('withMCP – actions', () => {
  test('registers tool and bridges execution to action', async () => {
    const { modelContext, tools, registerToolSpy, unregisterToolSpy } =
      createModelContext()

    const add = action(
      (left: number, right: number) => left + right,
      'add',
    ).extend(
      withMCP({
        description: 'Add two numbers',
        inputSchema: {
          type: 'object',
          properties: { left: { type: 'number' }, right: { type: 'number' } },
          required: ['left', 'right'],
        },
        modelContext,
        params: ({ left, right }: { left: number; right: number }) => [
          left,
          right,
        ],
      }),
    )

    const unregister = add.registerMCP()
    expect(registerToolSpy).toBeCalledTimes(1)
    expect(await tools.get('add')!.execute({ left: 2, right: 3 }, client)).toBe(
      5,
    )
    unregister()
    expect(unregisterToolSpy).toBeCalledTimes(1)
    expect(unregisterToolSpy).toBeCalledWith('add')
  })

  test('duplicate registration is caller responsibility', () => {
    const { modelContext, registerToolSpy, unregisterToolSpy } =
      createModelContext()
    const ping = action(() => 'pong', 'ping').extend(withMCP({ modelContext }))
    const unregister = ping.registerMCP()
    expect(registerToolSpy).toBeCalledTimes(1)
    expect(() => ping.registerMCP()).toThrow('already registered')
    unregister()
    expect(unregisterToolSpy).toBeCalledTimes(1)
    expect(unregisterToolSpy).toBeCalledWith('ping')
  })

  test('autoRegister registers immediately on extend', () => {
    const { modelContext, registerToolSpy } = createModelContext()
    action(() => 'pong', 'ping').extend(
      withMCP({ autoRegister: true, modelContext }),
    )
    expect(registerToolSpy).toBeCalledTimes(1)
  })

  test('returns noop unsubscribe when no modelContext available', () => {
    const ping = action(() => 'pong', 'ping').extend(withMCP({}))
    expect(() => ping.registerMCP()()).not.toThrow()
  })

  test('default params forward input as first argument', async () => {
    const { modelContext, tools } = createModelContext()
    const echo = action((input: { text: string }) => input.text, 'echo').extend(
      withMCP({ modelContext }),
    )
    const unregister = echo.registerMCP()
    expect(await tools.get('echo')!.execute({ text: 'hello' }, client)).toBe(
      'hello',
    )
    unregister()
  })

  test('register-time modelContext overrides extension-time one', async () => {
    const { modelContext, tools } = createModelContext()
    const ping = action(() => 'pong', 'ping').extend(withMCP({}))
    const unregister = ping.registerMCP({ modelContext })
    expect(await tools.get('ping')!.execute({}, client)).toBe('pong')
    unregister()
  })

  test('generates meaningful default description', () => {
    const { modelContext, tools } = createModelContext()
    const doSome = action(() => 'ok', 'doSome').extend(
      withMCP({ modelContext }),
    )
    const unregister = doSome.registerMCP()
    expect(tools.get('doSome')?.description).toBe(
      'Use this tool to interact with "doSome".',
    )
    unregister()
  })
})

describe('withMCP – atoms', () => {
  test('registers tool on first init and reads current state', async () => {
    const { modelContext, tools, registerToolSpy } = createModelContext()
    const user = atom({ id: 'u1', role: 'admin' }, 'user').extend(
      withMCP({ modelContext, annotations: { readOnlyHint: true } }),
    )
    user()
    await Promise.resolve()
    expect(registerToolSpy).toBeCalledTimes(1)
    expect(await tools.get('user')!.execute({}, client)).toEqual({
      id: 'u1',
      role: 'admin',
    })
  })

  test('generates meaningful default description', async () => {
    const { modelContext, tools } = createModelContext()
    const stateAtom = atom({ ok: true }, 'stateAtom').extend(
      withMCP({ modelContext }),
    )
    stateAtom()
    await Promise.resolve()
    expect(tools.get('stateAtom')?.description).toBe(
      'Use this tool to interact with "stateAtom".',
    )
  })
})

describe('withMCP – types', () => {
  test('action type exposes registerMCP', () => {
    const addToCard = action(
      (input: { goodsId: string; quantity: number }) => input.quantity,
      'addToCard',
    ).extend(withMCP({}))
    expectTypeOf(addToCard).toHaveProperty('registerMCP')
    expectTypeOf(addToCard.registerMCP).returns.toEqualTypeOf<Unsubscribe>()
  })

  test('atom type does not expose registerMCP', () => {
    const searchAtom = atom('', 'searchAtom').extend(withMCP({}))
    type HasRegisterMCP = 'registerMCP' extends keyof typeof searchAtom
      ? true
      : false
    expectTypeOf<HasRegisterMCP>().toEqualTypeOf<false>()
    // @ts-expect-error registerMCP exists only on action targets
    ;() => searchAtom.registerMCP()
  })
})
