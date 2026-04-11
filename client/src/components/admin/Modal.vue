<script setup>
defineProps(["show"]);
defineEmits(["close"]);
</script>

<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4"
  >
    <div class="bg-white p-5 sm:p-6 rounded-lg w-full max-w-md">
      <slot />
      <button @click="$emit('close')" class="mt-4 text-red-500">
        Close
      </button>
    </div>
  </div>
</template>