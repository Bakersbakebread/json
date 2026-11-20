<script setup lang="ts">
import { computed, inject } from 'vue'
import { Crosshair, TriangleAlert } from 'lucide-vue-next'
import { documentKey } from '../composables/useJsonDocument'
import ToolButton from './ToolButton.vue'

defineEmits<{ goToError: [] }>()
const { error, debounced } = inject(documentKey)!

// The offending line, trimmed to a window around the column, with a caret under it
const snippet = computed(() => {
  const e = error.value
  if (!e?.line || !e.column) return null
  const text = (debounced.value ?? '').split('\n')[e.line - 1] ?? ''
  const start = Math.max(0, e.column - 40)
  const line = (start > 0 ? '…' : '') + text.slice(start, start + 80)
  const caret = ' '.repeat(e.column - 1 - start + (start > 0 ? 1 : 0)) + '^'
  return { line, caret }
})
</script>

<template>
  <div v-if="error" role="alert" class="flex flex-col items-start gap-3 p-4 font-sans">
    <p class="flex items-center gap-2 font-semibold text-danger">
      <TriangleAlert class="size-5 shrink-0" aria-hidden="true" />
      <span v-if="error.line" class="tabular-nums">Line {{ error.line }}, column {{ error.column }}</span>
      <span v-else>Not valid JSON</span>
    </p>
    <p class="text-small wrap-anywhere">{{ error.message }}</p>
    <pre
      v-if="snippet"
      class="max-w-full overflow-x-auto rounded-control border border-rule bg-bg p-3 font-mono text-small"
    >{{ snippet.line }}
<span class="font-bold text-danger">{{ snippet.caret }}</span></pre>
    <ToolButton v-if="error.offset !== undefined" :icon="Crosshair" label="Go to error" @click="$emit('goToError')" />
  </div>
</template>
