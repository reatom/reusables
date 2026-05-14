import { action, atom } from '@reatom/core'
import { withMCP } from './with-mcp'

const goodsAtom = atom(
  [
    { id: 'sku-1', title: 'Laptop', price: 1200 },
    { id: 'sku-2', title: 'Keyboard', price: 120 },
  ],
  'marketplace.goods',
).extend(
  withMCP({
    name: 'list-goods',
    description: 'List currently available goods in the marketplace.',
    annotations: { readOnlyHint: true },
  }),
)

const searchAtom = atom('', 'marketplace.search').extend(withMCP({}))

goodsAtom()
searchAtom()

const cartAtom = atom<Array<{ goodsId: string; quantity: number }>>([], 'cart')

const addToCard = action((input: { goodsId: string; quantity: number }) => {
  cartAtom.set((state) => [...state, input])
  return { ok: true, cartSize: cartAtom().length }
}, 'addToCard').extend(
  withMCP({
    description: 'Add a goods item to the shopping cart.',
    inputSchema: {
      type: 'object',
      properties: {
        goodsId: { type: 'string', description: 'SKU identifier' },
        quantity: { type: 'number', minimum: 1 },
      },
      required: ['goodsId', 'quantity'],
    },
  }),
)

const unregisterAddToCard = addToCard.registerMCP()
unregisterAddToCard()

const translate = action(
  (text: string, targetLang: string) => `${text} → ${targetLang}`,
  'translate',
).extend(
  withMCP({
    description: 'Translate text to a target language.',
    inputSchema: {
      type: 'object',
      properties: {
        text: { type: 'string' },
        targetLang: { type: 'string', description: 'ISO 639-1 language code' },
      },
      required: ['text', 'targetLang'],
    },
    params: ({ text, targetLang }: { text: string; targetLang: string }) => [
      text,
      targetLang,
    ],
  }),
)

const unregisterTranslate = translate.registerMCP()
unregisterTranslate()
