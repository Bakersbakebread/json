<script setup lang="ts">
import type { Component } from 'vue'

// A small toolbar button: icon plus label. `labelClass` hides the label at narrow
// widths (e.g. "hidden @lg:inline"); `iconOnly` drops it and shows a tooltip instead.
// The label is always the accessible name.
const props = withDefaults(
  defineProps<{
    icon: Component
    label: string
    labelClass?: string
    iconOnly?: boolean
    variant?: 'primary' | 'secondary' | 'danger'
  }>(),
  { labelClass: '', iconOnly: false, variant: 'secondary' },
)

const VARIANTS = { primary: 'btn-primary', secondary: 'btn-secondary', danger: 'btn-danger' }
</script>

<template>
  <button
    type="button"
    class="btn btn-sm"
    :class="[VARIANTS[props.variant], { 'px-2': iconOnly }]"
    :aria-label="label"
    :title="iconOnly ? label : undefined"
  >
    <component :is="icon" class="size-4" aria-hidden="true" />
    <span v-if="!iconOnly" :class="labelClass">{{ label }}</span>
  </button>
</template>
