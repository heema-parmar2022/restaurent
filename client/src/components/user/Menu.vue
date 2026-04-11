<script setup>
import { ref, onMounted, computed } from "vue";
import api from "../../api/api";
import { useUserStore } from "../../stores/userStore";
import { useRoute } from "vue-router";

import CategoryBar from "../../components/user/CategoryBar.vue";
import FoodCard from "../../components/user/FoodCard.vue";
import CartBar from "../../components/user/CartBar.vue";

const store = useUserStore();
const route = useRoute();

const foods = ref([]);
const categories = ref([]);
const selected = ref(null);
const loading = ref(true);

onMounted(async () => {
  store.setTable(route.params.id);

  const [f, c] = await Promise.all([
    api.get("/foods"),
    api.get("/categories"),
  ]);

  foods.value = f.data;
  categories.value = c.data;

  loading.value = false;
});

const filtered = computed(() =>
  foods.value.filter(f =>
    !selected.value || f.category?._id === selected.value
  )
);
</script>

<template>
  <div class="bg-gray-100 min-h-screen">

    <!-- HEADER -->
    <div class="bg-white p-4 shadow-sm">
      <h1 class="text-lg font-bold">Restaurant Menu</h1>
    </div>

    <CategoryBar
      :categories="categories"
      :selected="selected"
      @select="selected = $event"
    />

    <!-- LOADING -->
    <div v-if="loading" class="p-4 grid grid-cols-2 gap-4">
      <div v-for="i in 6" :key="i" class="h-40 bg-gray-200 animate-pulse rounded-xl"></div>
    </div>

    <!-- FOOD GRID -->
    <div v-else class="grid grid-cols-2 md:grid-cols-3 gap-4 p-4">
      <FoodCard v-for="f in filtered" :key="f._id" :food="f" />
    </div>

    <CartBar />

  </div>
</template>