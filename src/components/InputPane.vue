<script setup lang="ts">
import { inject, useTemplateRef } from 'vue'
import { useDropZone, useFileDialog } from '@vueuse/core'
import { FileUp, FlaskConical, Trash2, Undo2 } from 'lucide-vue-next'
import { documentKey } from '../composables/useJsonDocument'
import { sample } from '../sample'
import ToolButton from './ToolButton.vue'

defineEmits<{ apply: [] }>()
const { input, error, undo, canUndo, load } = inject(documentKey)!

const textarea = useTemplateRef<HTMLTextAreaElement>('textarea')
const dropTarget = useTemplateRef<HTMLElement>('dropTarget')

async function loadFile(file: File | undefined) {
  if (file) load(await file.text(), file.name)
}

const { open: openFile, onChange } = useFileDialog({ accept: '.json,application/json,text/plain', multiple: false, reset: true })
onChange((files) => loadFile(files?.[0]))

const { isOverDropZone } = useDropZone(dropTarget, {
  multiple: false,
  // Only take over file drops; dragged text keeps the textarea's own behaviour
  checkValidity: (items) => [...items].some((item) => item.kind === 'file'),
  onDrop: (files) => loadFile(files?.[0]),
})

function goToError() {
  const offset = error.value?.offset
  if (offset === undefined || !textarea.value) return
  textarea.value.focus()
  textarea.value.setSelectionRange(offset, offset + 1)
}

defineExpose({ goToError })
</script>

<template>
  <div class="@container flex min-h-0 min-w-0 flex-col gap-2">
    <div class="flex items-center gap-2 *:shrink-0">
      <h2 class="label mr-1">Input</h2>
      <ToolButton :icon="FileUp" label="Open file" label-class="hidden @lg:inline" @click="openFile()" />
      <ToolButton :icon="FlaskConical" label="Sample" label-class="hidden @lg:inline" @click="load(sample, 'sample.json')" />
      <ToolButton :icon="Undo2" label="Undo" label-class="hidden @lg:inline" :disabled="!canUndo" @click="undo" />
      <ToolButton :icon="Trash2" label="Clear" variant="danger" class="ml-auto" :disabled="!input" @click="load('')" />
    </div>

    <div ref="dropTarget" class="flex min-h-0 flex-1">
      <textarea
        ref="textarea"
        v-model="input"
        class="field size-full resize-none p-3 font-mono text-small"
        :class="{ 'border-ink bg-highlight': isOverDropZone }"
        spellcheck="false"
        autocomplete="off"
        autocapitalize="off"
        placeholder="Paste JSON here, or drop a .json file"
        aria-label="JSON input"
        aria-describedby="input-caption"
        @keydown.ctrl.enter.prevent="$emit('apply')"
        @keydown.meta.enter.prevent="$emit('apply')"
      ></textarea>
    </div>
  </div>
</template>
