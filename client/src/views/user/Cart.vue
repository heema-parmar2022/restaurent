<script setup>
import { ref } from "vue";
import { useUserStore } from "../../stores/userStore";
import { useRouter } from "vue-router";
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

const store = useUserStore();
const router = useRouter();
const isPlacingOrder = ref(false);

const total = () =>
  store.cart.reduce((s, i) => s + i.price * i.qty, 0);

const place = async () => {
  if (isPlacingOrder.value) return;
  
  isPlacingOrder.value = true;
  try {
    await store.placeOrder();
    toast.success("Success! Your order has been placed.", { autoClose: 2500, position: toast.POSITION.TOP_CENTER });
    setTimeout(() => router.push(`/status`), 1000);
  } catch (err) {
    toast.error(err.message || "Failed to place order.", { autoClose: 4000, position: toast.POSITION.TOP_CENTER });
    isPlacingOrder.value = false;
  }
};
</script>

<template>
  <div class="bg-gray-50 min-h-screen pb-20 p-4">
    <div class="max-w-md mx-auto bg-white rounded-xl shadow-sm p-4 mt-4 border border-gray-100">
      <h1 class="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">Your Order Cart</h1>

      <div v-if="store.cart.length === 0" class="text-center text-gray-500 py-10">
        <p>Your cart is empty!</p>
        <button @click="router.push('/')" class="mt-4 text-indigo-600 font-bold hover:underline">← Go back to Menu</button>
      </div>

      <div v-else>
        <div v-for="i in store.cart" :key="i._id" class="flex justify-between items-center mb-4 pb-4 border-b border-gray-50">
          <div>
             <h3 class="font-bold text-gray-800">{{ i.name }}</h3>
             <p class="text-xs text-gray-500 mt-0.5">₹{{ i.price }}</p>
          </div>
          
          <div class="flex items-center gap-4">
            <div class="flex items-center bg-gray-50 border border-gray-200 text-gray-700 rounded-lg overflow-hidden">
              <button @click="store.decrease(i._id)" class="px-3 py-1 hover:bg-gray-200 font-bold transition">-</button>
              <span class="px-2 font-semibold min-w-[24px] text-center text-sm">{{ i.qty }}</span>
              <button @click="store.add(i)" class="px-3 py-1 hover:bg-gray-200 font-bold transition">+</button>
            </div>
            <span class="font-bold w-16 text-right">₹{{ i.price * i.qty }}</span>
          </div>
        </div>

        <div class="mt-6 border-t border-dashed border-gray-300 pt-6">
          <div class="flex justify-between text-lg mb-2">
            <span class="text-gray-600 font-medium">Item Total</span>
            <span class="font-medium">₹{{ total() }}</span>
          </div>
          <div class="flex justify-between text-xl font-bold mt-2 pt-2 border-t text-gray-900">
            <span>To Pay</span>
            <span>₹{{ total() }}</span>
          </div>
        </div>

        <button 
          @click="place" 
          :disabled="isPlacingOrder"
          class="mt-8 flex justify-between items-center w-full transition text-white px-6 py-4 rounded-xl font-bold shadow-md text-lg"
          :class="isPlacingOrder ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'"
        >
          <span>₹{{ total() }}</span>
          <span v-if="isPlacingOrder">Placing Order...</span>
          <span v-else>Place Order <span class="ml-2 font-normal">→</span></span>
        </button>
      </div>
    </div>
  </div>
</template>