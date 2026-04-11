<script setup>
import { useUserStore } from "../../stores/userStore";
import { useRouter } from "vue-router";
import { onMounted, onUnmounted } from "vue";

const store = useUserStore();
const router = useRouter();

let pollInterval;

onMounted(() => {
  store.fetchMyOrder();
  pollInterval = setInterval(() => {
    store.fetchMyOrder();
  }, 5000); // refresh every 5s
});

onUnmounted(() => {
  clearInterval(pollInterval);
});

</script>

<template>
  <div class="bg-gray-50 min-h-screen pb-20 p-4 flex flex-col items-center">
    <div v-if="store.orders.length === 0" class="text-center p-10 bg-white rounded-xl shadow-sm border border-gray-100 w-full max-w-md mt-10">
      <h2 class="text-xl font-bold text-gray-800">No active orders</h2>
      <button @click="router.push('/')" class="mt-4 bg-indigo-600 hover:bg-indigo-700 transition text-white px-6 py-2 rounded-lg font-bold">Go to Menu</button>
    </div>

    <div v-else class="w-full max-w-5xl mt-6 px-2">
      <div class="flex justify-between items-center mb-6 border-b pb-4">
         <h1 class="text-2xl font-bold text-gray-800">Your Active Orders</h1>
         <button @click="router.push('/')" class="bg-indigo-600 hover:bg-indigo-700 transition shadow-sm text-white px-4 py-2 rounded-lg font-bold text-sm tracking-wide">
           + New Order
         </button>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="order in store.orders" :key="order._id" class="bg-white rounded-xl shadow-sm border border-gray-100 text-center relative overflow-hidden flex flex-col">
          
          <div class="absolute top-0 right-0 m-3 px-3 py-1 rounded-full text-xs font-black uppercase shadow-sm z-10"
               :class="{
                 'bg-orange-100 text-orange-700 border border-orange-200': order.status === 'preparing',
                 'bg-green-100 text-green-700 border border-green-200': order.status === 'ready',
                 'bg-blue-100 text-blue-700 border border-blue-200': order.status === 'pending'
               }">
               {{ order.status }}
          </div>

          <div class="bg-indigo-50 p-6 border-b border-indigo-100 shrink-0">
            <div class="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-sm text-3xl mb-4">
              <span v-if="order.status === 'pending'">🕒</span>
              <span v-else-if="order.status === 'preparing'">🍳</span>
              <span v-else-if="order.status === 'ready'">✅</span>
              <span v-else></span>
            </div>
            <p class="text-indigo-600 font-bold text-xl mt-1 tracking-wider">{{ order.token }}</p>
          </div>

          <div class="p-6 pb-4 flex flex-col flex-grow">
            <div class="mb-auto">
            </div>

            <div class="text-left border-t border-gray-100 pt-4 mt-4">
              <div class="flex justify-between font-bold text-lg text-gray-900">
                <span>Amount Paid</span>
                <span class="text-indigo-600">₹{{ order.totalAmount }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>