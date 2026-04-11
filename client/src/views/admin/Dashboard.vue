<script setup>
import { ref, onMounted } from "vue";
import api from "../../api/api";
import Card from "../../components/admin/Card.vue";

const stats = ref({});

onMounted(async () => {
  const orders = (await api.get("/orders")).data;

  stats.value = {
    orders: orders.length,
    revenue: orders.reduce((s, o) => s + o.totalAmount, 0),
  };
});
</script>

<template>
  <div class="grid grid-cols-2 gap-4">
    <Card title="Total Orders" :value="stats.orders" />
    <Card title="Revenue" :value="'₹' + stats.revenue" />
  </div>
</template>