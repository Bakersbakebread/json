<script setup lang="ts">
import { computed, inject, ref } from 'vue'
import { childPath, entries, isContainer, type Json } from '../json'
import { treeKey } from '../composables/useTree'

const props = defineProps<{ name: string | number | null; value: Json; path: string; depth: number }>()
const tree = inject(treeKey)!

// Long arrays and objects render in pages so a huge file does not lock the tab
const PAGE = 200
const limit = ref(PAGE)

const container = computed(() => isContainer(props.value))
const children = computed(() => (isContainer(props.value) ? entries(props.value) : []))
const open = computed(() => container.value && tree.expanded.has(props.path))
const isMatch = computed(() => tree.matches.value.has(props.path))
const isSelected = computed(() => tree.selected.value?.path === props.path)

const summary = computed(() => {
  const n = children.value.length
  return Array.isArray(props.value) ? `${n} ${n === 1 ? 'item' : 'items'}` : `${n} ${n === 1 ? 'key' : 'keys'}`
})

const display = computed(() => {
  const v = props.value
  if (typeof v === 'string') return { text: JSON.stringify(v), tone: 'text-code-string' }
  if (!isContainer(v)) return { text: String(v), tone: 'text-code-literal' }
  return null
})

// First click selects and opens; clicking the selected node again toggles it
function activate() {
  const wasSelected = isSelected.value
  tree.selected.value = { path: props.path, key: props.name, value: props.value }
  if (!container.value) return
  if (open.value && wasSelected) tree.expanded.delete(props.path)
  else tree.expanded.add(props.path)
}
</script>

<template>
  <li>
    <div
      class="flex items-baseline gap-2 pr-2"
      :class="isMatch ? 'bg-highlight **:text-ink!' : isSelected ? 'bg-ink/10' : 'hover:bg-ink/5'"
      :style="{ paddingLeft: `${depth * 1.25}rem` }"
    >
      <button
        type="button"
        class="flex shrink-0 cursor-pointer items-baseline gap-1 rounded-control py-0.5 text-left"
        :aria-expanded="container ? open : undefined"
        @click="activate"
      >
        <svg
          v-if="container"
          class="size-3 shrink-0 self-center text-muted"
          :class="{ 'rotate-90': open }"
          viewBox="0 0 12 12"
          aria-hidden="true"
        >
          <path d="M4 2l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.5" />
        </svg>
        <span v-else class="size-3 shrink-0" aria-hidden="true"></span>
        <span v-if="name === null" class="text-muted">$</span>
        <span v-else-if="typeof name === 'number'" class="text-muted tabular-nums">{{ name }}</span>
        <span v-else class="font-semibold wrap-anywhere">{{ name }}</span>
      </button>
      <span v-if="display" class="min-w-0 wrap-anywhere" :class="display.tone">{{ display.text }}</span>
      <span v-else class="text-muted tabular-nums">
        {{ Array.isArray(value) ? '[ ]' : '{ }' }} {{ summary }}
      </span>
    </div>
    <ul v-if="open && isContainer(value)">
      <JsonNode
        v-for="[key, child] in children.slice(0, limit)"
        :key="key"
        :name="key"
        :value="child"
        :path="childPath(path, key)"
        :depth="depth + 1"
      />
      <li v-if="children.length > limit" :style="{ paddingLeft: `${(depth + 1) * 1.25 + 1}rem` }" class="py-1">
        <button type="button" class="btn btn-sm btn-secondary font-sans tabular-nums" @click="limit += PAGE">
          Show {{ Math.min(PAGE, children.length - limit) }} more of {{ children.length - limit }}
        </button>
      </li>
    </ul>
  </li>
</template>
