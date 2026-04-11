<script setup>
import { useUserStore } from "../../stores/userStore";
import { useRouter } from "vue-router";

const store = useUserStore();
const router = useRouter();

const total = () =>
  store.cart.reduce((s, i) => s + i.price * i.qty, 0);

const place = async () => {
  await store.placeOrder();
  router.push(`/table/${store.tableId}/status`);
};
</script>

<template>
  <div class="bg-gray-100 min-h-screen p-4">

    <h1 class="text-xl font-bold mb-4">Your Cart</h1>

    <div v-if="!store.cart.length" class="text-center text-gray-500 mt-10">
      Cart is empty
    </div>

    <div v-else class="space-y-3">
      <div
        v-for="i in store.cart"
        :key="i._id"
        class="bg-white p-4 rounded-xl shadow flex justify-between"
      >
        <span>{{ i.name }} x {{ i.qty }}</span>
        <span>₹{{ i.price * i.qty }}</span>
      </div>
    </div>

    <div v-if="store.cart.length" class="mt-6">
      <div class="text-lg font-bold">Total: ₹{{ total() }}</div>

      <button
        @click="place"
        class="mt-4 w-full bg-green-500 text-white p-3 rounded-xl"
      >
        Place Order
      </button>
    </div>

  </div>
</template>