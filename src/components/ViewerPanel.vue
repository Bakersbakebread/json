<script setup lang="ts">
import { inject } from 'vue'
import { Crosshair, ListTree, TriangleAlert } from 'lucide-vue-next'
import { documentKey } from '../composables/useJsonDocument'
import EmptyState from './EmptyState.vue'
import PropertyGrid from './PropertyGrid.vue'
import ToolButton from './ToolButton.vue'
import TreePanel from './TreePanel.vue'

defineEmits<{ showError: [] }>()
const { value, error } = inject(documentKey)!
</script>

<template>
  <section
    id="panel-viewer"
    role="tabpanel"
    aria-labelledby="tab-viewer"
    class="flex min-h-0 flex-1 animate-rise flex-col gap-2"
  >
    <div
      v-if="value !== undefined"
      class="grid min-h-0 flex-1 grid-rows-2 gap-4 lg:grid-cols-2 lg:grid-rows-1 lg:gap-8"
    >
      <TreePanel />
      <div class="flex min-h-0 min-w-0 flex-col lg:border-l lg:border-rule lg:pl-8">
        <PropertyGrid />
      </div>
    </div>
    <div v-else-if="error" class="flex flex-wrap items-center gap-x-4 gap-y-2 text-small text-danger">
      <p class="flex min-w-0 flex-1 items-center gap-2">
        <TriangleAlert class="size-4 shrink-0" aria-hidden="true" />The text is not valid JSON, so there is nothing to view yet.
      </p>
      <ToolButton :icon="Crosshair" label="Show error" @click="$emit('showError')" />
    </div>
    <EmptyState v-else :icon="ListTree" text="Paste or open some JSON on the Text tab to see it here." />

    <p v-if="value !== undefined" class="caption hidden sm:block">
      Click a key in the tree, or an underlined name in the table, to look inside it. Search opens the parents of every match.
    </p>
  </section>
</template>
