<script setup>
const props = defineProps({ order: Object });
const emit = defineEmits(["close"]);
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
    
    <div class="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden">
      
      <div class="bg-gray-50 border-b px-6 py-4 flex justify-between items-center">
        <h3 class="text-lg font-bold text-gray-800">Order Invoice</h3>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">✕</button>
      </div>
      
      <div class="p-6">

        <div class="flex justify-between items-end mb-6">
          <div>
            <p class="text-sm text-gray-500">Token ID</p>
            <p class="text-2xl font-bold text-gray-900">{{ order.token || 'N/A' }}</p>
          </div>
          <div class="text-right">
            <p class="text-sm text-gray-500">Date</p>
            <p class="font-medium text-gray-800">
              {{ new Date(order.createdAt).toLocaleDateString() }}
            </p>
          </div>
        </div>

        <table class="w-full text-left mb-6">
          <thead>
            <tr class="border-b text-sm text-gray-500">
              <th class="pb-2 font-medium">Item</th>
              <th class="pb-2 font-medium text-right">Qty</th>
              <th class="pb-2 font-medium text-right">Total</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-gray-100">
            <tr v-for="item in order.items" :key="item._id" class="text-gray-800 text-sm">
              <td class="py-3">{{ item.food?.name || 'Unknown' }}</td>
              <td class="py-3 text-right">{{ item.qty }}</td>
              <td class="py-3 text-right">
                ₹{{ (item.food?.price || 0) * item.qty }}
              </td>
            </tr>
          </tbody>

          <tfoot>
            <tr class="text-lg border-t border-gray-200">
              <td colspan="2" class="pt-4 font-bold text-right pr-4 text-gray-800">
                Total Amount
              </td>
              <td class="pt-4 font-bold text-right text-gray-900">
                ₹{{ order.totalAmount }}
              </td>
            </tr>
          </tfoot>
        </table>

      </div>
      
      <div class="bg-gray-50 border-t px-6 py-4 flex justify-end gap-3">
        <button 
          @click="$emit('close')" 
          class="px-4 py-2 border rounded-lg hover:bg-gray-100 transition text-gray-700"
        >
          Close
        </button>
      </div>

    </div>
  </div>
</template>