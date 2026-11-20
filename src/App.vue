<script setup lang="ts">
import { computed, nextTick, provide, useTemplateRef } from 'vue'
import { useLocalStorage, useSessionStorage } from '@vueuse/core'
import { documentKey, useJsonDocument } from './composables/useJsonDocument'
import { treeKey, useTree } from './composables/useTree'
import { usePalette } from './composables/usePalette'
import AppHeader, { type Tab } from './components/AppHeader.vue'
import DocumentStats from './components/DocumentStats.vue'
import InputPane from './components/InputPane.vue'
import OutputPane from './components/OutputPane.vue'
import PaneSplitter from './components/PaneSplitter.vue'
import ViewerPanel from './components/ViewerPanel.vue'

const doc = useJsonDocument()
provide(documentKey, doc)
provide(treeKey, useTree(doc))

const { choice: palette, prefersDark } = usePalette()
const tab = useSessionStorage<Tab>('json-tab', 'text')

// Pane split on wide screens; the middle track is the splitter
const SPLITS = ['1fr auto 3fr', '1fr auto 1fr', '3fr auto 1fr']
const storedSplit = useLocalStorage('json-split', 1)
const split = computed({
  get: () => Math.min(2, Math.max(0, storedSplit.value)),
  set: (v: number) => (storedSplit.value = v),
})
const splitColumns = computed(() => SPLITS[split.value]!.replace(/(\d)fr/g, 'minmax(0,$1fr)'))

const inputPane = useTemplateRef<InstanceType<typeof InputPane>>('inputPane')
const outputPane = useTemplateRef<InstanceType<typeof OutputPane>>('outputPane')

function showError() {
  tab.value = 'text'
  nextTick(() => inputPane.value?.goToError())
}
</script>

<template>
  <!-- One viewport tall; the active panel fills whatever the header leaves -->
  <main class="flex h-dvh w-full flex-col gap-3 px-4 pt-2 pb-3 sm:px-6">
    <AppHeader v-model:tab="tab" v-model:palette="palette" :prefers-dark="prefersDark" />

    <section
      v-show="tab === 'text'"
      id="panel-text"
      role="tabpanel"
      aria-labelledby="tab-text"
      class="flex min-h-0 flex-1 animate-rise flex-col gap-2"
    >
      <div
        class="grid min-h-0 flex-1 grid-rows-2 gap-4 transition-[grid-template-columns] duration-300 ease-out lg:grid-cols-(--split) lg:grid-rows-1 lg:gap-0"
        :style="{ '--split': splitColumns }"
      >
        <InputPane ref="inputPane" @apply="outputPane?.applyToInput()" />
        <PaneSplitter v-model="split" />
        <OutputPane ref="outputPane" @go-to-error="inputPane?.goToError()" />
      </div>
      <DocumentStats />
    </section>

    <ViewerPanel v-if="tab === 'viewer'" @show-error="showError" />
  </main>
</template>
