<script setup>
import { ref, onMounted } from "vue";
import api from "../../api/api";
import { useUserStore } from "../../stores/userStore";

import CategoryBar from "../../components/user/CategoryBar.vue";
import FoodCard from "../../components/user/FoodCard.vue";
import CartBar from "../../components/user/CartBar.vue";
import LoadingSpinner from "../../components/LoadingSpinner.vue";

const store = useUserStore();

const foods = ref([]);
const categories = ref([]);
const selected = ref(null);
const loading = ref(true);

onMounted(async () => {
  loading.value = true;
  await new Promise(resolve => setTimeout(resolve, 500));

  const f = await api.get("/foods?limit=1000");
  const c = await api.get("/categories");

  const rFoods = Array.isArray(f.data) ? f.data : f.data.data || [];
  const rCategories = Array.isArray(c.data) ? c.data : c.data.data || [];

  categories.value = rCategories.filter(cat => cat.isActive !== false);
  foods.value = rFoods.filter(f => !f.category || f.category.isActive !== false);

  loading.value = false;
});

// loader when changing categories
const changeCategory = async (catId) => {
  loading.value = true;
  await new Promise(resolve => setTimeout(resolve, 400)); // 400ms delay
  selected.value = catId;
  loading.value = false;
};
</script>

<template>
  <div class="bg-gray-50 min-h-screen pb-20">
    <CategoryBar
      :categories="categories"
      :selected="selected"
      @select="changeCategory"
    />

    <div v-if="loading" class="mt-20">
      <LoadingSpinner />
    </div>

    <div v-else class="p-4 max-w-6xl mx-auto space-y-12">
      
      <section 
        v-for="cat in categories.filter(c => !selected || c._id === selected)" 
        :key="cat._id" 
      >
        <div class="mb-4 border-b pb-2">
          <h2 class="text-xl font-light text-gray-500 tracking-widest uppercase">{{ cat.name }}</h2>
        </div>
        
        <div class="flex flex-col sm:flex-row sm:flex-wrap gap-6">
          <div class="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]" v-for="f in foods.filter(food => food.category?._id === cat._id)" :key="f._id">
            <FoodCard 
              :food="f" 
            />
          </div>
        </div>
        
        <div v-if="foods.filter(food => food.category?._id === cat._id).length === 0" class="text-gray-400 italic text-sm py-4">
          No items found in this section.
        </div>
      </section>

      <div v-if="foods.length === 0" class="text-center p-8 text-gray-500 bg-white rounded-lg shadow-sm border border-dashed border-gray-300 mt-10">
        No items currently available.
      </div>
    </div>

    <CartBar />
  </div>
</template>