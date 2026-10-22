<script setup lang="ts">
import ConfirmHost from '@/components/ConfirmHost.vue'
import MToastHost from '@/components/generic/MToastHost.vue'
import CartDrawer from '@/modules/cart/CartDrawer.vue'
</script>

<template>
  <RouterView />
  <CartDrawer />
  <ConfirmHost />
  <MToastHost />
</template>
