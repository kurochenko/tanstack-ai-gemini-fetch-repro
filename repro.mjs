import { chat } from '@tanstack/ai'
import { createGeminiChat } from '@tanstack/ai-gemini'

// Fail loudly if a request skips the custom fetch.
globalThis.fetch = async (input) => {
  throw new Error(`global fetch called for ${input}`)
}

let customFetchCalls = 0
const myFetch = async () => {
  customFetchCalls++
  const chunk = {
    candidates: [
      { content: { role: 'model', parts: [{ text: 'hi' }] }, finishReason: 'STOP' },
    ],
  }
  return new Response(`data: ${JSON.stringify(chunk)}\n\n`, {
    headers: { 'content-type': 'text/event-stream' },
  })
}

const adapter = createGeminiChat('gemini-2.5-flash', 'fake-key', {
  httpOptions: { fetch: myFetch },
})

async function main() {
  let text = ''
  let error
  for await (const chunk of chat({
    threadId: 'repro',
    adapter,
    messages: [{ role: 'user', content: 'Hi' }],
  })) {
    if (chunk.type === 'TEXT_MESSAGE_CONTENT') text += chunk.delta
    if (chunk.type === 'RUN_ERROR') error = chunk.message
  }
  console.log(JSON.stringify({ text, customFetchCalls, error }))
}

main()
