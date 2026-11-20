import { computed, type InjectionKey } from 'vue'
import { createEventHook, refDebounced, useDebouncedRefHistory, useSessionStorage } from '@vueuse/core'
import { parse, stats, typeOf, type Json } from '../json'

export function useJsonDocument() {
  const input = useSessionStorage('json-input', '')
  const fileName = useSessionStorage('json-file-name', 'data.json')
  const { undo, canUndo } = useDebouncedRefHistory(input, { debounce: 400, capacity: 50 })

  // Parse slightly behind typing so large documents do not stall the textarea
  const debounced = refDebounced(input, 150)
  const result = computed(() => (debounced.value?.trim() ? parse(debounced.value) : null))
  const value = computed<Json | undefined>(() => (result.value?.ok ? result.value.value : undefined))
  const error = computed(() => (result.value && !result.value.ok ? result.value : null))

  const status = computed(() => {
    if (!result.value) return { text: 'No input', tone: 'idle' } as const
    if (result.value.ok) return { text: 'Valid JSON', tone: 'valid' } as const
    const line = result.value.line
    return { text: line ? `Invalid at line ${line}` : 'Invalid JSON', tone: 'error' } as const
  })

  const summary = computed(() => {
    const bytes = new TextEncoder().encode(input.value).length
    const size = bytes < 1024 ? `${bytes} B` : bytes < 1048576 ? `${(bytes / 1024).toFixed(1)} KB` : `${(bytes / 1048576).toFixed(2)} MB`
    if (value.value === undefined) return { size, type: null, nodes: 0, depth: 0 }
    return { size, type: typeOf(value.value), ...stats(value.value) }
  })

  // Fires when a whole new document arrives (file, sample, clear), not on typing
  const loaded = createEventHook<void>()
  function load(text: string, name = 'data.json') {
    input.value = text
    fileName.value = name
    loaded.trigger()
  }

  return { input, fileName, debounced, value, error, status, summary, undo, canUndo, load, onLoad: loaded.on }
}

export type JsonDocument = ReturnType<typeof useJsonDocument>
export const documentKey: InjectionKey<JsonDocument> = Symbol('document')
