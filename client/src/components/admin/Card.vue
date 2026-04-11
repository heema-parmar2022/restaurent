<script setup>
defineProps(["title", "value"]);
</script>

<template>
  <div class="bg-white p-4 rounded-xl shadow w-full">
    <h3 class="text-gray-500 text-sm sm:text-base">{{ title }}</h3>
    <p class="text-xl sm:text-2xl font-bold">{{ value }}</p>
  </div>
</template>