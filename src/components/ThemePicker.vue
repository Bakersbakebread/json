<script setup lang="ts">
import { computed, useTemplateRef } from 'vue'
import { Check, Palette, X } from 'lucide-vue-next'
import { AUTO_DARK, AUTO_LIGHT, palettes } from '../palettes'
import PalettePreview from './PalettePreview.vue'
import ToolButton from './ToolButton.vue'

const choice = defineModel<string>({ required: true })
defineProps<{ prefersDark: boolean }>()

const dialog = useTemplateRef<HTMLDialogElement>('dialog')
const groups = [
  { label: 'Light', items: palettes.filter((p) => !p.dark) },
  { label: 'Dark', items: palettes.filter((p) => p.dark) },
]

const currentName = computed(() =>
  choice.value === 'auto' ? 'Auto' : (palettes[Number(choice.value)]?.name ?? 'Auto'),
)

// Clicking the backdrop (the dialog element itself, outside its content) closes it
function backdropClose(event: MouseEvent) {
  if (event.target === dialog.value) dialog.value?.close()
}
</script>

<template>
  <button type="button" class="btn btn-sm btn-secondary" aria-haspopup="dialog" @click="dialog?.showModal()">
    <Palette class="size-4" aria-hidden="true" /><span class="hidden sm:inline">{{ currentName }}</span>
    <span class="sr-only sm:hidden">Theme: {{ currentName }}</span>
  </button>

  <dialog
    ref="dialog"
    class="m-auto max-h-[calc(100dvh-2rem)] w-[min(52rem,calc(100%-2rem))] rounded-control border border-rule bg-bg p-0 text-ink backdrop:bg-ink/40"
    aria-labelledby="theme-title"
    @click="backdropClose"
  >
    <div class="flex flex-col gap-5 p-5 sm:p-6">
      <div class="flex items-center gap-3 border-b border-rule pb-4">
        <Palette class="size-5" aria-hidden="true" />
        <h2 id="theme-title" class="label mr-auto">Theme</h2>
        <ToolButton :icon="X" label="Close" icon-only @click="dialog?.close()" />
      </div>

      <fieldset class="flex flex-col gap-5">
        <legend class="sr-only">Colour palette</legend>

        <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <label class="group flex cursor-pointer flex-col gap-2 rounded-control">
            <input v-model="choice" type="radio" name="palette" value="auto" class="sr-only" />
            <span
              class="relative flex aspect-[16/10] overflow-hidden rounded-control border-2 transition-colors"
              :class="choice === 'auto' ? 'border-ink' : 'border-rule group-hover:border-control'"
            >
              <span class="w-1/2 overflow-hidden"><span class="block h-full w-[200%]"><PalettePreview :id="AUTO_LIGHT" /></span></span>
              <span class="w-1/2 overflow-hidden"><span class="-ml-[100%] block h-full w-[200%]"><PalettePreview :id="AUTO_DARK" /></span></span>
              <span v-if="choice === 'auto'" class="absolute top-1.5 right-1.5 grid size-5 animate-pop place-items-center rounded-full bg-ink text-bg">
                <Check class="size-3.5" aria-hidden="true" />
              </span>
            </span>
            <span class="text-small">
              <span class="font-semibold">Auto</span>
              <span class="text-muted"> follows your system, {{ prefersDark ? 'Night' : 'Peach' }} now</span>
            </span>
          </label>
        </div>

        <section v-for="group in groups" :key="group.label" class="flex flex-col gap-3">
          <h3 class="flex items-center gap-3 text-small font-semibold text-muted">
            {{ group.label }}<span class="h-px flex-1 bg-rule"></span>
          </h3>
          <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <label v-for="p in group.items" :key="p.id" class="group flex cursor-pointer flex-col gap-2 rounded-control">
              <input v-model="choice" type="radio" name="palette" :value="String(p.id)" class="sr-only" />
              <span
                class="relative block aspect-[16/10] overflow-hidden rounded-control border-2 transition-colors"
                :class="choice === String(p.id) ? 'border-ink' : 'border-rule group-hover:border-control'"
              >
                <PalettePreview :id="p.id" />
                <span v-if="choice === String(p.id)" class="absolute top-1.5 right-1.5 grid size-5 animate-pop place-items-center rounded-full bg-ink text-bg">
                  <Check class="size-3.5" aria-hidden="true" />
                </span>
              </span>
              <span class="text-small font-semibold">{{ p.name }}</span>
            </label>
          </div>
        </section>
      </fieldset>

      <p class="caption border-t border-rule pt-4">
        The page changes as you pick, and the choice is saved in this browser. Arrow keys move between themes, Esc closes.
      </p>
    </div>
  </dialog>
</template>
