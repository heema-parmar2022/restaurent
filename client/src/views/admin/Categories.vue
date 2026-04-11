<script setup>
import { ref, onMounted } from "vue";
import api from "../../api/api";

const categories = ref([]);
const show = ref(false);
const editing = ref(null);
const name = ref("");

const fetch = async () => {
  categories.value = (await api.get("/categories")).data;
};

const add = async () => {
  await api.post("/categories", { name: name.value });
  name.value = "";
  show.value = false;
  fetch();
};

const remove = async (id) => {
  if (!confirm("Delete?")) return;

  try {
    await api.delete(`/categories/${id}`);
    fetch();
  } catch (e) {
    alert("Cannot delete: Category has food items");
  }
};

const toggle = async (c) => {
  await api.put(`/categories/${c._id}/toggle`);
  fetch();
};

const startEdit = (c) => {
  editing.value = { ...c };
};

const update = async () => {
  await api.put(`/categories/${editing.value._id}`, editing.value);
  editing.value = null;
  fetch();
};

onMounted(fetch);
</script>

<template>
  <div class="p-6 space-y-6">

    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-bold">Category Manage</h2>

      <button
        @click="show = true"
        class="bg-green-500 text-white px-4 py-2 rounded"
      >
        + Add Category
      </button>
    </div>

    <div class="bg-white rounded-xl shadow overflow-hidden">
      <table class="w-full text-sm">

        <thead class="bg-gray-100">
          <tr>
            <th class="p-3 text-left">Name</th>
            <th>Status</th>
            <th class="text-right pr-4">Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="c in categories"
            :key="c._id"
            class="border-t h-14"
          >
            <td class="p-3 font-medium">{{ c.name }}</td>

            <td>
              <button
                @click="toggle(c)"
                :class="c.isActive ? 'bg-green-500' : 'bg-gray-400'"
                class="px-2 py-1 text-white rounded text-xs"
              >
                {{ c.isActive ? "Active" : "Inactive" }}
              </button>
            </td>

            <td class="text-right pr-4 space-x-2">
              <button
                @click="startEdit(c)"
                class="bg-blue-500 text-white px-3 py-1 rounded text-xs"
              >
                Edit
              </button>

              <button
                @click="remove(c._id)"
                class="bg-red-500 text-white px-3 py-1 rounded text-xs"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>

      </table>
    </div>

    <div v-if="show" class="fixed inset-0 bg-black/40 flex justify-center items-center">
      <div class="bg-white p-6 rounded-xl w-80">

        <h3 class="mb-3 font-semibold">Add Category</h3>

        <input
          v-model="name"
          placeholder="Category name"
          class="border p-2 w-full mb-3"
        />

        <div class="flex justify-end gap-2">
          <button @click="show=false">Cancel</button>
          <button @click="add" class="bg-green-500 text-white px-3 py-1 rounded">
            Save
          </button>
        </div>

      </div>
    </div>

    <div v-if="editing" class="fixed inset-0 bg-black/40 flex justify-center items-center">
      <div class="bg-white p-6 rounded-xl w-80">

        <h3 class="mb-3 font-semibold">Edit Category</h3>

        <input
          v-model="editing.name"
          class="border p-2 w-full mb-3"
        />

        <div class="flex justify-end gap-2">
          <button @click="editing=null">Cancel</button>
          <button @click="update" class="bg-blue-500 text-white px-3 py-1 rounded">
            Update
          </button>
        </div>

      </div>
    </div>

  </div>
</template>