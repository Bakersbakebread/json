<script setup lang="ts">
import { computed, inject } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import { ArrowDownAZ, ArrowLeftToLine, Braces, Check, Copy, Download, Minimize2 } from 'lucide-vue-next'
import { documentKey } from '../composables/useJsonDocument'
import { useCopy } from '../composables/useCopy'
import { sortKeys } from '../json'
import CodeView from './CodeView.vue'
import EmptyState from './EmptyState.vue'
import ErrorPanel from './ErrorPanel.vue'
import ToolButton from './ToolButton.vue'

defineEmits<{ goToError: [] }>()
const { input, fileName, value, error } = inject(documentKey)!
const { copy, copiedId, isSupported: canCopy } = useCopy()

const style = useLocalStorage<'formatted' | 'minified'>('json-output-style', 'formatted')
const indent = useLocalStorage<'2' | '4' | 'tab'>('json-indent', '2')
const sorted = useLocalStorage('json-sort-keys', false)

const styles = [
  { id: 'formatted', label: 'Formatted', icon: Braces },
  { id: 'minified', label: 'Minified', icon: Minimize2 },
] as const

const output = computed(() => {
  if (value.value === undefined) return ''
  const v = sorted.value ? sortKeys(value.value) : value.value
  if (style.value === 'minified') return JSON.stringify(v)
  return JSON.stringify(v, null, indent.value === 'tab' ? '\t' : Number(indent.value))
})

// Replace the input with the output; Undo steps back
function applyToInput() {
  if (output.value) input.value = output.value
}

function download() {
  const url = URL.createObjectURL(new Blob([output.value], { type: 'application/json' }))
  const a = document.createElement('a')
  a.href = url
  a.download = fileName.value
  a.click()
  URL.revokeObjectURL(url)
}

defineExpose({ applyToInput })
</script>

<template>
  <div class="@container flex min-h-0 min-w-0 flex-col gap-2">
    <div class="flex items-center gap-2 *:shrink-0">
      <h2 class="label mr-1">Output</h2>
      <div role="group" aria-label="Output style" class="flex h-8 items-center rounded-control border border-control p-0.5">
        <button
          v-for="s in styles"
          :key="s.id"
          type="button"
          :aria-label="s.label"
          :aria-pressed="style === s.id"
          class="flex h-full cursor-pointer items-center gap-1.5 rounded-[2px] px-2 text-small font-semibold transition-colors"
          :class="style === s.id ? 'bg-ink text-bg' : 'text-muted hover:text-ink'"
          @click="style = s.id"
        >
          <component :is="s.icon" class="size-4" aria-hidden="true" /><span class="hidden @sm:inline">{{ s.label }}</span>
        </button>
      </div>
      <select v-model="indent" class="field h-8 px-2 text-small disabled:opacity-45" aria-label="Indent" :disabled="style === 'minified'">
        <option value="2">2 spaces</option>
        <option value="4">4 spaces</option>
        <option value="tab">Tabs</option>
      </select>
      <ToolButton
        :icon="ArrowDownAZ"
        label="Sort keys"
        label-class="hidden @xl:inline"
        :class="{ 'border-ink bg-ink/10': sorted }"
        :aria-pressed="sorted"
        @click="sorted = !sorted"
      />
    </div>

    <div class="relative flex min-h-0 flex-1">
      <!-- Window actions sit outside the scroller so they stay in the corner -->
      <div v-if="output" class="absolute top-2 right-5 z-10 flex gap-1 rounded-control bg-surface p-0.5">
        <ToolButton :icon="ArrowLeftToLine" label="Use as input" icon-only class="bg-surface" :disabled="output === input" @click="applyToInput" />
        <ToolButton
          v-if="canCopy"
          :icon="copiedId === 'output' ? Check : Copy"
          :label="copiedId === 'output' ? 'Copied' : 'Copy output'"
          icon-only
          class="bg-surface"
          @click="copy('output', output)"
        />
        <ToolButton :icon="Download" label="Download output" icon-only class="bg-surface" @click="download" />
      </div>

      <div class="min-h-0 flex-1 overflow-auto rounded-control border border-control bg-surface font-mono text-small">
        <CodeView v-if="output" :text="output" :wrap="style === 'minified'" />
        <ErrorPanel v-else-if="error" @go-to-error="$emit('goToError')" />
        <EmptyState v-else :icon="Braces" text="Formatted output appears here as you type." />
      </div>
    </div>
  </div>
</template>
