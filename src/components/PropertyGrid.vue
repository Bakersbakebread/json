<script setup lang="ts">
import { computed, inject } from 'vue'
import { Check, Copy, Link, MapPin } from 'lucide-vue-next'
import { childPath, entries, isContainer, type Json } from '../json'
import { treeKey } from '../composables/useTree'
import ToolButton from './ToolButton.vue'

const tree = inject(treeKey)!

// With nothing selected, the grid shows the root
const current = computed(() => tree.selected.value ?? { path: '$', key: null, value: tree.root.value as Json })

const rows = computed(() => {
  const { key, value } = current.value
  return isContainer(value) ? entries(value) : [[key ?? '$', value] as [string | number, Json]]
})

function describe(v: Json) {
  if (typeof v === 'string') return { text: JSON.stringify(v), tone: 'text-code-string' }
  if (!isContainer(v)) return { text: String(v), tone: 'text-code-literal' }
  const n = entries(v).length
  return Array.isArray(v)
    ? { text: `[ ] ${n} ${n === 1 ? 'item' : 'items'}`, tone: 'text-muted' }
    : { text: `{ } ${n} ${n === 1 ? 'key' : 'keys'}`, tone: 'text-muted' }
}

function open(key: string | number, value: Json) {
  tree.expanded.add(current.value.path)
  tree.selected.value = { path: childPath(current.value.path, key), key, value }
}
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col gap-2">
    <div class="flex min-h-8 flex-wrap items-center gap-x-4 gap-y-2">
      <code class="flex min-w-0 flex-1 items-center gap-2 font-mono text-small wrap-anywhere">
        <MapPin class="size-4 shrink-0 text-muted" aria-hidden="true" />{{ current.path }}
      </code>
      <div class="flex gap-2">
        <ToolButton
          :icon="tree.copiedId.value === 'path' ? Check : Link"
          :label="tree.copiedId.value === 'path' ? 'Copied' : 'Copy path'"
          @click="tree.copy('path', current.path)"
        />
        <ToolButton
          :icon="tree.copiedId.value === 'value' ? Check : Copy"
          :label="tree.copiedId.value === 'value' ? 'Copied' : 'Copy value'"
          @click="tree.copy('value', JSON.stringify(current.value, null, 2))"
        />
      </div>
    </div>

    <div class="min-h-0 flex-1 overflow-auto border-y border-rule">
      <table class="w-full font-mono text-small">
        <thead class="sticky top-0 bg-bg font-sans text-muted">
          <tr class="border-b border-rule text-left">
            <th scope="col" class="w-2/5 py-2 pr-4 font-normal">Name</th>
            <th scope="col" class="py-2 font-normal">Value</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-rule">
          <tr v-for="[key, child] in rows" :key="key" class="align-baseline">
            <th scope="row" class="py-2 pr-4 text-left font-semibold wrap-anywhere">
              <button
                v-if="isContainer(child)"
                type="button"
                class="cursor-pointer rounded-control text-left underline decoration-control underline-offset-4 hover:decoration-ink"
                @click="open(key, child)"
              >{{ key }}</button>
              <span v-else :class="{ 'font-normal text-muted tabular-nums': typeof key === 'number' }">{{ key }}</span>
            </th>
            <td class="py-2 wrap-anywhere" :class="describe(child).tone">{{ describe(child).text }}</td>
          </tr>
        </tbody>
      </table>
      <p v-if="rows.length === 0" class="py-3 text-small text-muted">Empty.</p>
    </div>
  </div>
</template>
