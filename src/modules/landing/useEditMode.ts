import { computed, ref } from 'vue'
import { useAuth } from '@/modules/auth/auth.hook'

const enabled = ref(false)

/** "Edit this page in place" switch. Only an admin can turn it on. */
export function useEditMode() {
  const { isAdmin } = useAuth()

  return {
    editMode: computed(() => isAdmin.value && enabled.value),
    toggle: () => (enabled.value = !enabled.value),
    set: (value: boolean) => (enabled.value = value),
  }
}
