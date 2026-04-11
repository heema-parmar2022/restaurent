<script setup>
import { useUserStore } from "../../stores/userStore";
import api from "../../api/api";

const store = useUserStore();

const download = async () => {
  const res = await api.get(`/orders/${store.order._id}/invoice`, {
    responseType: "blob",
  });

  const url = URL.createObjectURL(res.data);
  const a = document.createElement("a");
  a.href = url;
  a.download = "invoice.pdf";
  a.click();
};
</script>

<template>
  <div class="p-4">
    <h1 class="text-xl font-bold">Invoice</h1>

    <div v-for="i in store.order?.items" :key="i._id">
      {{ i.food?.name }} x {{ i.qty }}
    </div>

    <h2 class="mt-4">Total: ₹{{ store.order?.totalAmount }}</h2>

    <button @click="download" class="mt-4 bg-black text-white p-2 rounded">
      Download PDF
    </button>
  </div>
</template>