<script setup lang="ts">
import { computed } from 'vue'
import { highlight } from '../highlight'

// Highlighted JSON. Formatted text gets a line-number gutter that stays put on
// sideways scroll; wrapped (minified) text has no lines worth numbering.
const props = defineProps<{ text: string; wrap?: boolean }>()

const html = computed(() => highlight(props.text))
const lineNumbers = computed(() => {
  const count = props.text.split('\n').length
  return Array.from({ length: count }, (_, i) => i + 1).join('\n')
})
</script>

<template>
  <div class="flex min-h-full" :class="wrap ? 'min-w-0' : 'min-w-max'">
    <pre
      v-if="!wrap"
      class="sticky left-0 shrink-0 border-r border-rule bg-surface p-3 text-right text-muted tabular-nums select-none"
      aria-hidden="true"
    >{{ lineNumbers }}</pre>
    <pre class="flex-1 p-3" :class="{ 'wrap-anywhere whitespace-pre-wrap': wrap }" aria-label="Output" v-html="html"></pre>
  </div>
</template>
