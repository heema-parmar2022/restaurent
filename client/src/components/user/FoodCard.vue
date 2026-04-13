<script setup>
import { computed } from "vue";
import { useUserStore } from "../../stores/userStore";
const props = defineProps({ food: Object });
const store = useUserStore();

const cartItem = computed(() => store.cart.find(i => i._id === props.food._id));
const qty = computed(() => cartItem.value?.qty || 0);

const imageUrl = computed(() => {
  if (!props.food.image || props.food.image === "default.png") {
    return "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80";
  }
  if (props.food.image.startsWith("http")) return props.food.image;

  const baseUrl =
    import.meta.env.MODE === "production"
      ? "https://restaurent-tiz5.onrender.com"
      : "http://localhost:5000";

  return `${baseUrl}/uploads/${props.food.image}`;
});
</script>

<template>
  <div class="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden border border-gray-100 flex flex-col p-5 relative h-full">
    
    <!-- IMAGE -->
    <div class="relative -mx-5 -mt-5 mb-4 shrink-0 bg-gray-100">
      <img
        :src="imageUrl"
        class="w-full h-40 object-cover"
        alt="Food Image"
        onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80'"
      />
      <span
          v-if="food.isSpecial"
          class="absolute top-0 right-5 bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-b-md font-bold tracking-wide shadow-sm uppercase z-10"
        >
          ⭐ Bestseller
      </span>
    </div>

    <!-- CONTENT -->
    <div class="mb-4 flex-grow flex flex-col justify-start">
      <div class="flex items-start justify-between">
         <h3 class="font-bold text-gray-900 text-xl leading-tight">
           {{ food.name }}
         </h3>
      </div>
      <p class="text-gray-500 text-sm mt-2 leading-snug">
        {{ food.notes || 'A wonderfully crafted local favorite. Perfectly seasoned to tantalize your tastebuds.' }}
      </p>
    </div>

    <!-- PRICING & ACTIONS -->
    <div class="flex justify-between items-end border-t border-gray-50 pt-4 mt-auto">
      <span class="font-black text-xl text-gray-900">
        ₹{{ food.price }}
      </span>

      <div class="flex items-center">
        <div v-if="qty > 0" class="flex items-center bg-gray-50 border border-gray-200 text-gray-800 rounded-lg overflow-hidden shadow-sm">
          <button @click="store.decrease(food._id)" class="px-3 py-1.5 hover:bg-gray-200 font-bold text-lg transition">-</button>
          <span class="px-2 font-bold min-w-[30px] text-center text-sm">{{ qty }}</span>
          <button @click="store.add(food)" class="px-3 py-1.5 hover:bg-gray-200 font-bold text-lg transition text-green-600">+</button>
        </div>

        <button
          v-else
          @click="store.add(food)"
          class="bg-white border hover:border-green-300 rounded-lg text-green-600 font-black px-6 py-1.5 shadow-sm hover:shadow transition uppercase text-sm"
        >
          Add
        </button>
      </div>
    </div>
  </div>
</template>