import { computed, watchEffect } from 'vue'
import { useLocalStorage, usePreferredDark } from '@vueuse/core'
import { AUTO_DARK, AUTO_LIGHT, palettes } from '../palettes'

/** The saved palette choice ("auto" or an id), applied to <html> and theme-color. */
export function usePalette() {
  const choice = useLocalStorage('json-palette', 'auto')
  const prefersDark = usePreferredDark()

  const active = computed(() => {
    const auto = palettes[prefersDark.value ? AUTO_DARK : AUTO_LIGHT]!
    return choice.value === 'auto' ? auto : (palettes[Number(choice.value)] ?? auto)
  })

  watchEffect(() => {
    document.documentElement.dataset.palette = String(active.value.id)
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', active.value.bg)
  })

  return { choice, prefersDark }
}
