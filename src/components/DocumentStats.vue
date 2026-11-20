<script setup lang="ts">
import { inject } from 'vue'
import { documentKey } from '../composables/useJsonDocument'

const { summary } = inject(documentKey)!
</script>

<template>
  <div class="flex flex-wrap items-baseline gap-x-6 gap-y-1">
    <dl class="flex flex-wrap gap-x-5 text-small tabular-nums">
      <div class="flex gap-2"><dt class="text-muted">Size</dt><dd>{{ summary.size }}</dd></div>
      <template v-if="summary.type">
        <div class="flex gap-2"><dt class="text-muted">Root</dt><dd>{{ summary.type }}</dd></div>
        <div class="flex gap-2"><dt class="text-muted">Nodes</dt><dd>{{ summary.nodes.toLocaleString() }}</dd></div>
        <div class="flex gap-2"><dt class="text-muted">Depth</dt><dd>{{ summary.depth }}</dd></div>
      </template>
    </dl>
    <p id="input-caption" class="caption sm:ml-auto">
      Nothing is uploaded; the text stays in this tab's session storage. Ctrl+Enter replaces the input with the output, Undo steps back.
    </p>
  </div>
</template>
