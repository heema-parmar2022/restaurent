<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import api from "../../api/api";
import InvoiceModal from "../../components/admin/InvoiceModal.vue";

const orders = ref([]);
const invoiceOrder = ref(null);
let pollInterval;

const fetchOrders = async () => {
  try {
    const res = await api.get("/orders");
    orders.value = res.data;
  } catch(e) {
    console.error("Failed to fetch orders");
  }
};

const updateOrder = async (orderId, payload) => {
  try {
    await api.put(`/orders/${orderId}/status`, payload);
    fetchOrders();
  } catch(e) {
    console.error("Update failed");
  }
};

onMounted(() => {
  fetchOrders();
  pollInterval = setInterval(fetchOrders, 5000); // Live poll
});

onUnmounted(() => {
  clearInterval(pollInterval);
});

// Helpers
const updateStatus = (orderId, status) => updateOrder(orderId, { status });
</script>

<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-800">Orders Status Manage</h2>
      <button @click="fetchOrders" class="bg-white border px-4 py-2 rounded shadow-sm text-sm font-medium hover:bg-gray-50 transition">Refresh</button>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50 border-b">
            <tr>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Token</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-100">
            <tr v-if="orders.length === 0">
              <td colspan="4" class="px-6 py-8 text-center text-gray-500">No orders available.</td>
            </tr>
            <tr v-for="o in orders" :key="o._id" :class="o.status === 'Collected' ? 'opacity-60 bg-gray-50' : 'hover:bg-blue-50/30 transition'">
              <td class="px-6 py-4 whitespace-nowrap font-bold text-indigo-600">
                {{ o.token || 'N/A' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <select :disabled="o.status === 'Collected'" :value="o.status" @change="updateStatus(o._id, $event.target.value)" class="border border-gray-300 rounded-md px-3 py-1.5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-sm bg-white font-medium text-gray-700 shadow-sm cursor-pointer hover:border-gray-400 disabled:opacity-50 disabled:bg-gray-100 disabled:cursor-not-allowed">
                  <option value="pending">Pending</option>
                  <option value="preparing">Preparing</option>
                  <option value="ready">Ready for Pickup</option>
                  <option value="Collected">Collected</option>
                </select>
              </td>
              <td class="px-6 py-4 whitespace-nowrap font-bold text-gray-900 text-lg">
                ₹{{ o.totalAmount }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                <button @click="invoiceOrder = o" class="text-indigo-600 hover:text-indigo-900 transition underline underline-offset-2">Invoice</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <InvoiceModal v-if="invoiceOrder" :order="invoiceOrder" @close="invoiceOrder = null" />
  </div>
</template>