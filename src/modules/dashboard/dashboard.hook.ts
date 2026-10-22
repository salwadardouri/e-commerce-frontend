import { ref } from 'vue'
import { useApi } from '@/composables/useApi'
import { useAsyncAction } from '@/composables/useAsyncAction'
import type { DashboardSummary } from '@/types/models'

export function useDashboard() {
  const api = useApi()
  const summary = ref<DashboardSummary | null>(null)

  const load = useAsyncAction(async () => {
    summary.value = await api.get<DashboardSummary>('/dashboard')
  })

  return { summary, load }
}
