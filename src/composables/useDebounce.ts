import { onBeforeUnmount, ref, watch, type Ref } from 'vue'

/** Returns a ref that follows `source` after `delay` ms of silence. */
export function useDebouncedRef<T>(source: Ref<T>, delay = 250): Ref<T> {
  const debounced = ref(source.value) as Ref<T>
  let timer: ReturnType<typeof setTimeout> | undefined

  watch(source, (value) => {
    clearTimeout(timer)
    timer = setTimeout(() => (debounced.value = value), delay)
  })
  onBeforeUnmount(() => clearTimeout(timer))

  return debounced
}
