<script setup lang="ts">
import { inject } from 'vue'
import { CircleCheck, CircleDashed, CircleX } from 'lucide-vue-next'
import { documentKey } from '../composables/useJsonDocument'

const { status } = inject(documentKey)!
</script>

<template>
  <p
    role="status"
    class="flex items-center gap-1.5 text-small font-semibold"
    :class="{ 'font-normal text-muted': status.tone === 'idle', 'text-ink': status.tone === 'valid', 'text-danger': status.tone === 'error' }"
  >
    <CircleCheck v-if="status.tone === 'valid'" class="size-4 shrink-0 text-live" aria-hidden="true" />
    <CircleX v-else-if="status.tone === 'error'" class="size-4 shrink-0" aria-hidden="true" />
    <CircleDashed v-else class="size-4 shrink-0" aria-hidden="true" />
    <span class="tabular-nums">{{ status.text }}</span>
  </p>
</template>
