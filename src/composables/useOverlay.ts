import { onBeforeUnmount, watch, type Ref } from 'vue'

let lockCount = 0

/** Shared behaviour of modal-like overlays: close on Escape and lock page scroll while open. */
export function useOverlay(open: Ref<boolean>, close: () => void) {
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') close()
  }

  const lock = () => {
    if (lockCount++ === 0) document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
  }
  const unlock = () => {
    if (--lockCount === 0) document.body.style.overflow = ''
    window.removeEventListener('keydown', onKey)
  }

  watch(
    open,
    (isOpen, wasOpen) => {
      if (isOpen) lock()
      else if (wasOpen) unlock()
    },
    { immediate: true },
  )

  onBeforeUnmount(() => {
    if (open.value) unlock()
  })
}
