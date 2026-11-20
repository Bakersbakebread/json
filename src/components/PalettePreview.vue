<script setup lang="ts">
// A miniature of the app in one palette: header, input pane, and output pane with a
// marker row. It reads the [data-palette] tokens, so it tracks style.css.
defineProps<{ id: number }>()
</script>

<template>
  <div :data-palette="id" class="flex h-full flex-col gap-1.5 bg-bg p-2" aria-hidden="true">
    <div class="flex items-center gap-1 border-b border-rule pb-1.5">
      <span class="h-1.5 w-6 rounded-full bg-ink"></span>
      <span class="size-1.5 rounded-full bg-live"></span>
      <span class="ml-auto h-1.5 w-4 rounded-full bg-muted"></span>
    </div>
    <div class="grid flex-1 grid-cols-2 gap-1.5">
      <div class="flex flex-col gap-1 rounded-[2px] border border-control bg-surface p-1.5">
        <span class="h-1 w-4/5 rounded-full bg-ink"></span>
        <span class="h-1 w-3/5 rounded-full bg-ink"></span>
        <span class="h-1 w-2/3 rounded-full bg-ink"></span>
        <span class="h-1 w-2/5 rounded-full bg-muted"></span>
      </div>
      <div class="flex flex-col gap-1 rounded-[2px] border border-control bg-surface p-1.5">
        <span class="flex gap-1"><span class="h-1 w-1/3 rounded-full bg-ink"></span><span class="h-1 w-1/3 rounded-full bg-code-string"></span></span>
        <span class="-mx-1 flex gap-1 bg-highlight px-1 py-0.5"><span class="h-1 w-1/4 rounded-full bg-ink"></span><span class="h-1 w-1/4 rounded-full bg-ink"></span></span>
        <span class="flex gap-1"><span class="h-1 w-1/3 rounded-full bg-ink"></span><span class="h-1 w-1/5 rounded-full bg-code-literal"></span></span>
        <span class="flex gap-1"><span class="h-1 w-1/4 rounded-full bg-ink"></span><span class="h-1 w-2/5 rounded-full bg-code-string"></span></span>
      </div>
    </div>
  </div>
</template>
