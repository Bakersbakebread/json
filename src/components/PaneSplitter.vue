<script setup lang="ts">
import { ChevronLeft, ChevronRight, Columns2 } from 'lucide-vue-next'
import ToolButton from './ToolButton.vue'

// 0 output wide, 1 even, 2 input wide
const split = defineModel<number>({ required: true })
</script>

<template>
  <!-- Shown only when the panes sit side by side -->
  <div
    class="relative hidden flex-col items-center justify-center gap-1.5 px-2 before:absolute before:inset-y-0 before:left-1/2 before:w-px before:bg-rule lg:flex"
    role="group"
    aria-label="Pane widths"
  >
    <ToolButton :icon="ChevronLeft" label="Widen output" icon-only class="relative z-10 bg-bg px-1!" :disabled="split === 0" @click="split--" />
    <ToolButton
      v-if="split !== 1"
      :icon="Columns2"
      label="Equal widths"
      icon-only
      class="relative z-10 animate-pop bg-bg px-1!"
      @click="split = 1"
    />
    <ToolButton :icon="ChevronRight" label="Widen input" icon-only class="relative z-10 bg-bg px-1!" :disabled="split === 2" @click="split++" />
  </div>
</template>
