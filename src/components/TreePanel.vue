<script setup lang="ts">
import { inject } from 'vue'
import { ChevronsDownUp, ChevronsUpDown, Search } from 'lucide-vue-next'
import { treeKey } from '../composables/useTree'
import ToolButton from './ToolButton.vue'
import JsonNode from './JsonNode.vue'

const tree = inject(treeKey)!
</script>

<template>
  <div class="flex min-h-0 min-w-0 flex-col gap-2">
    <div class="flex items-center gap-2 *:shrink-0">
      <label class="relative flex w-0 min-w-0 flex-1 shrink! items-center">
        <Search class="pointer-events-none absolute left-2.5 size-4 text-muted" aria-hidden="true" />
        <input
          v-model="tree.query.value"
          type="search"
          class="field h-8 w-full pr-3 pl-8 text-small"
          placeholder="Search"
          aria-label="Search keys and values"
        />
      </label>
      <p v-if="tree.query.value" class="text-small text-muted tabular-nums" aria-live="polite">
        {{ tree.matches.value.size }} {{ tree.matches.value.size === 1 ? 'match' : 'matches' }}
      </p>
      <ToolButton :icon="ChevronsUpDown" label="Expand all" @click="tree.expandAll" />
      <ToolButton :icon="ChevronsDownUp" label="Collapse all" @click="tree.collapseAll" />
    </div>

    <ul
      class="min-h-0 flex-1 overflow-auto border-y border-rule py-2 font-mono text-small"
    >
      <JsonNode v-if="tree.root.value !== undefined" :name="null" :value="tree.root.value" path="$" :depth="0" />
    </ul>
  </div>
</template>
