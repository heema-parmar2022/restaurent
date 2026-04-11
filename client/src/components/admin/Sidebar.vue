<script setup>
defineProps(["isOpen"]);
defineEmits(["close"]);
</script>

<template>
  <div>

    <!-- Overlay -->
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
      @click="$emit('close')"
    ></div>

    <!-- Sidebar -->
    <div
      class="fixed md:static top-0 left-0 h-full w-64 bg-black text-white p-5 space-y-4 z-50 transform transition-transform duration-300"
      :class="isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'"
    >
      <div class="mb-8 mt-2 pb-6 border-b border-gray-800">
        <div class="text-2xl font-black tracking-tighter text-white uppercase">
            Hp's <span class="text-gray-500 tracking-normal font-medium">Kitchen</span>
        </div>
        <span class="text-xs text-indigo-400 font-bold uppercase tracking-[0.2em] mt-1 block">Dine in food order system</span>
      </div>

      <router-link to="/admin/dashboard" class="block hover:text-green-400">Dashboard</router-link>
      <router-link to="/admin/categories" class="block hover:text-green-400">Categories</router-link>
      <router-link to="/admin/foods" class="block hover:text-green-400">Foods</router-link>
      <router-link to="/admin/orders" class="block hover:text-green-400">Orders</router-link>
    </div>

  </div>
</template>