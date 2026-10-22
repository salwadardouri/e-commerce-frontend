<script setup lang="ts">
import { computed } from 'vue'
import { useConfirm } from '@/composables/useConfirm'
import MButton from '@/components/generic/MButton.vue'
import MModal from '@/components/generic/MModal.vue'

const { pending, answer } = useConfirm()
const open = computed({
  get: () => pending.value !== null,
  set: (v) => {
    if (!v) answer(false)
  },
})
</script>

<template>
  <MModal v-model="open" :title="pending?.title" size="sm">
    <p class="text-sm text-ink-soft">{{ pending?.message }}</p>
    <template #footer>
      <MButton variant="ghost" @click="answer(false)">Annuler</MButton>
      <MButton :variant="pending?.tone === 'primary' ? 'primary' : 'danger'" @click="answer(true)">
        {{ pending?.confirmLabel ?? 'Confirmer' }}
      </MButton>
    </template>
  </MModal>
</template>
