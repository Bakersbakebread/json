<script setup lang="ts">
import type { Component } from 'vue'

defineProps<{ icon: Component; text: string }>()
</script>

<template>
  <div class="flex h-full flex-1 flex-col items-center justify-center gap-2 p-6 text-center font-sans text-small text-muted">
    <component :is="icon" class="size-8" aria-hidden="true" />
    <p>{{ text }}</p>
  </div>
</template>
