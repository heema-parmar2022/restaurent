<script setup>
import { useUserStore } from "../../stores/userStore";
const store = useUserStore();
</script>

<template>
  <router-link
    v-if="store.cart.length"
    :to="'/cart'"
    class="fixed bottom-0 left-0 right-0 bg-indigo-600 shadow-xl text-white p-4 flex justify-between items-center rounded-t-xl"
  >
    <span class="font-bold cursor-pointer">{{ store.cart.length }} items | ₹{{ store.cart.reduce((s, i) => s + i.price * i.qty, 0) }}</span>
    <span class="font-bold flex items-center gap-2">View Cart <span class="bg-indigo-800 rounded-full px-2 py-0.5 text-xs">→</span></span>
  </router-link>
</template>