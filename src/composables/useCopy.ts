import { computed, ref } from 'vue'
import { useClipboard } from '@vueuse/core'

/** Clipboard copy that remembers which button asked, so only that one says "Copied". */
export function useCopy() {
  const { copy: copyText, copied, isSupported } = useClipboard({ legacy: true, copiedDuring: 1500 })
  const last = ref<string | null>(null)
  const copiedId = computed(() => (copied.value ? last.value : null))

  function copy(id: string, text: string) {
    last.value = id
    copyText(text)
  }

  return { copy, copiedId, isSupported }
}
