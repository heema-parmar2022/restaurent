<script setup>
defineProps(["categories", "selected"]);
defineEmits(["select"]);
</script>

<template>
  <div class="sticky top-0 bg-white z-20 shadow-sm border-b border-gray-100">
    <div class="flex gap-3 p-3 overflow-x-auto flex-nowrap items-center no-scrollbar touch-pan-x">

      <button
        @click="$emit('select', null)"
        class="px-4 py-2 rounded-full text-sm"
        :class="!selected ? 'bg-black text-white' : 'bg-gray-100'"
      >
        All
      </button>

      <button
        v-for="c in categories"
        :key="c._id"
        @click="$emit('select', c._id)"
        class="px-4 py-2 rounded-full text-sm whitespace-nowrap transition"
        :class="
          selected === c._id
            ? 'bg-black text-white shadow'
            : 'bg-gray-100 hover:bg-gray-200'
        "
      >
        {{ c.name }}
      </button>

    </div>
  </div>
</template>

<style>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>