import { computed, reactive, ref, shallowRef, watch, type InjectionKey, type Ref } from 'vue'
import { refDebounced } from '@vueuse/core'
import { isContainer, walk, type Json } from '../json'
import { useCopy } from './useCopy'
import type { JsonDocument } from './useJsonDocument'

export interface Selection {
  path: string
  key: string | number | null
  value: Json
}

export interface TreeContext {
  root: Ref<Json | undefined>
  expanded: Set<string>
  matches: Ref<Set<string>>
  query: Ref<string>
  selected: Ref<Selection | null>
  expandAll: () => void
  collapseAll: () => void
  copy: (id: string, text: string) => void
  copiedId: Ref<string | null>
}

export const treeKey: InjectionKey<TreeContext> = Symbol('tree')

/** Expansion, selection and search for the viewer. Lives as long as the app, so switching tabs keeps it. */
export function useTree(doc: Pick<JsonDocument, 'value' | 'onLoad'>): TreeContext {
  const { value } = doc
  const expanded = reactive(new Set<string>())
  const selected = shallowRef<Selection | null>(null)
  const query = ref('')
  const debouncedQuery = refDebounced(query, 200)
  const { copy, copiedId } = useCopy()

  function defaultExpansion(root: Json) {
    expanded.clear()
    walk(root, (v, path, depth) => {
      if (depth < 2 && isContainer(v)) expanded.add(path)
    })
  }

  // Keep expanded nodes across edits; only a new document gets the default expansion
  doc.onLoad(() => expanded.clear())
  watch(value, (root) => {
    selected.value = null
    if (root !== undefined && !expanded.has('$')) defaultExpansion(root)
  })

  const search = computed(() => {
    const found = new Set<string>()
    const parents = new Set<string>()
    const q = debouncedQuery.value.trim().toLowerCase()
    if (!q || value.value === undefined) return { found, parents }
    walk(value.value, (v, path, _, key, ancestors) => {
      const hit =
        (typeof key === 'string' && key.toLowerCase().includes(q)) ||
        (!isContainer(v) && String(v).toLowerCase().includes(q))
      if (!hit) return
      found.add(path)
      for (const a of ancestors) parents.add(a)
    })
    return { found, parents }
  })

  // Open the parents of every match; the user can still collapse them afterwards
  watch(search, ({ parents }) => parents.forEach((p) => expanded.add(p)))

  return {
    root: value,
    expanded,
    matches: computed(() => search.value.found),
    query,
    selected,
    copy,
    copiedId,
    expandAll() {
      if (value.value === undefined) return
      walk(value.value, (v, path) => {
        if (isContainer(v)) expanded.add(path)
      })
    },
    collapseAll() {
      expanded.clear()
      expanded.add('$')
    },
  }
}
