<script setup lang="ts">
import { FileText, ListTree } from 'lucide-vue-next'
import StatusBadge from './StatusBadge.vue'
import ThemePicker from './ThemePicker.vue'

export type Tab = 'text' | 'viewer'

const tab = defineModel<Tab>('tab', { required: true })
const palette = defineModel<string>('palette', { required: true })
defineProps<{ prefersDark: boolean }>()

const tabs = [
  { id: 'text', label: 'Text', icon: FileText },
  { id: 'viewer', label: 'Viewer', icon: ListTree },
] as const

function tabKeys(event: KeyboardEvent) {
  if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
  tab.value = tab.value === 'text' ? 'viewer' : 'text'
  document.getElementById(`tab-${tab.value}`)?.focus()
}
</script>

<template>
  <header class="flex flex-wrap items-end gap-x-6 border-b border-rule">
    <h1 class="w-full pt-1 pb-1 font-mono text-body font-bold sm:w-auto sm:pt-0 sm:pb-2">json<span class="inline-block animate-fall text-live">.</span><a
      href="https://seanthorne.co.uk"
      target="_blank"
      rel="noopener"
      class="font-normal text-muted underline-offset-4 hover:text-ink hover:underline"
    >seanthorne.co.uk</a></h1>

    <div role="tablist" aria-label="View" class="flex gap-5" @keydown="tabKeys">
      <button
        v-for="t in tabs"
        :id="`tab-${t.id}`"
        :key="t.id"
        type="button"
        role="tab"
        :aria-selected="tab === t.id"
        :aria-controls="`panel-${t.id}`"
        :tabindex="tab === t.id ? 0 : -1"
        class="-mb-px flex cursor-pointer items-center gap-1.5 border-b-2 pb-2 font-semibold transition-colors"
        :class="tab === t.id ? 'border-ink text-ink' : 'border-transparent text-muted hover:text-ink'"
        @click="tab = t.id"
      >
        <component :is="t.icon" class="size-4" aria-hidden="true" />{{ t.label }}
      </button>
    </div>

    <div class="ml-auto flex items-center gap-4 pb-2">
      <StatusBadge />
      <ThemePicker v-model="palette" :prefers-dark="prefersDark" />
    </div>
  </header>
</template>
