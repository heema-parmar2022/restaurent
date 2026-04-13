<script setup>
import { ref, onMounted } from "vue";
import api from "../../api/api";
import LoadingSpinner from "../../components/LoadingSpinner.vue";

const loading = ref(true);

const foods = ref([]);
const specials = ref([]);
const categories = ref([]);

const page = ref(1);
const totalPages = ref(1);

const form = ref({
  name: "",
  price: "",
  category: "",
  notes: "",
});

const editing = ref(null);
const showAddModal = ref(false);
const imageFile = ref(null);
const editImageFile = ref(null);

const formError = ref("");
const baseURL =
  typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://restaurent-tiz5.onrender.com";
const validateForm = (data) => {
  if (!data.name) return "Name is required";
  if (!data.price) return "Price is required";
  if (!data.category) return "Category is required";
  if (isNaN(data.price)) return "Price must be number";
  return null;
};

const fetch = async () => {
  loading.value = true;
  try {
    await new Promise(resolve => setTimeout(resolve, 800));

    const res = await api.get(`/foods?page=${page.value}&limit=10`);
    foods.value = res.data.data;
    totalPages.value = res.data.pages;

    const sp = await api.get(`/foods?special=true`);
    specials.value = sp.data.data;

    const cat = await api.get("/categories");
    categories.value = cat.data;
  } finally {
    loading.value = false;
  }
};

const handleFile = (e) => {
  imageFile.value = e.target.files[0];
};

const handleEditFile = (e) => {
  editImageFile.value = e.target.files[0];
};

const add = async () => {
  const errorMsg = validateForm(form.value);
  if (errorMsg) {
    formError.value = errorMsg;
    return;
  }
  formError.value = "";

  const formData = new FormData();

  formData.append("name", form.value.name);
  formData.append("price", form.value.price);
  formData.append("category", form.value.category);
  formData.append("notes", form.value.notes);

  if (imageFile.value) {
    formData.append("image", imageFile.value);
  } else {
    formData.append("image", "default.png");
  }

  await api.post("/foods", formData);

  showAddModal.value = false;
  form.value = { name: "", price: "", category: "", notes: "" };
  imageFile.value = null;

  fetch();
};

const remove = async (id) => {
  if (!confirm("Delete?")) return;
  await api.delete(`/foods/${id}`);
  fetch();
};

const toggle = async (f) => {
  if (f.isSpecial && f.isActive) {
    alert("Remove from special before making inactive");
    return;
  }

  await api.put(`/foods/${f._id}/toggle`);
  fetch();
};

const toggleSpecial = async (f) => {
  if (!f.isActive) {
    alert("Inactive food cannot be special");
    return;
  }

  await api.put(`/foods/${f._id}/special`);
  fetch();
};

const startEdit = (f) => {
  editing.value = {
    ...f,
    category: f.category && f.category._id ? f.category._id : "",
  };
};

const update = async () => {
  const errorMsg = validateForm(editing.value);
  if (errorMsg) {
    formError.value = errorMsg;
    return;
  }
  formError.value = "";

  const formData = new FormData();

  formData.append("name", editing.value.name);
  formData.append("price", editing.value.price);
  formData.append("category", editing.value.category);
  formData.append("notes", editing.value.notes);

  if (editImageFile.value) {
    formData.append("image", editImageFile.value);
  }

  await api.put(`/foods/${editing.value._id}`, formData);

  editing.value = null;
  editImageFile.value = null;

  fetch();
};

onMounted(fetch);
</script>

<template>
  <div class="p-4 sm:p-6 space-y-6">

    <div v-if="loading" class="flex justify-center py-20">
      <LoadingSpinner />
    </div>

    <template v-else>
    <div class="flex flex-col sm:flex-row justify-between gap-3 sm:items-center">
      <h2 class="text-2xl sm:text-3xl font-bold text-gray-800"> Food Manage</h2>

      <button
        @click="showAddModal = true"
        class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg w-full sm:w-auto"
      >
        + Add Food
      </button>
    </div>

    <div>
      <h3 class="text-lg sm:text-xl font-semibold text-yellow-600 mb-3">⭐ Today's Special</h3>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div v-for="f in specials" :key="f._id"
          class="bg-yellow-50 border p-4 rounded-xl shadow">

          <h3 class="font-semibold">{{ f.name }}</h3>
          <p>₹{{ f.price }}</p>
          <p class="text-sm text-gray-500">{{ f.notes }}</p>

          <button
            @click="toggleSpecial(f)"
            class="mt-2 bg-red-500 text-white px-3 py-1 rounded w-full"
          >
            Remove
          </button>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-xl shadow overflow-hidden">

      <div class="w-full overflow-x-auto">

        <table class="min-w-[800px] w-full text-sm table-auto">
          <thead class="bg-gray-100">
            <tr>
              <th class="p-3 whitespace-nowrap">Image</th>
              <th class="whitespace-nowrap">Name</th>
              <th class="whitespace-nowrap">Price</th>
              <th class="whitespace-nowrap">Category</th>
              <th class="hidden sm:table-cell whitespace-nowrap">Notes</th>
              <th class="whitespace-nowrap">Status</th>
              <th class="whitespace-nowrap">Special</th>
              <th class="whitespace-nowrap">Actions</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="f in foods" :key="f._id"
              class="border-t text-center h-16 align-middle whitespace-nowrap">

              <td class="p-2">
                <img
                  v-if="f.image"
                  :src="`${baseURL}/uploads/${f.image}`"
                  class="w-10 h-10 sm:w-12 sm:h-12 rounded object-cover mx-auto"
                />
              </td>

              <td class="text-xs sm:text-sm">{{ f.name }}</td>
              <td>₹{{ f.price }}</td>

              <td>
                {{ f.category && f.category.name ? f.category.name : "-" }}
              </td>

              <td class="text-xs text-gray-500 hidden sm:table-cell">
                {{ f.notes }}
              </td>

              <td>
                <button
                  @click="toggle(f)"
                  :disabled="f.isSpecial && f.isActive"
                  :class="[
                    f.isActive ? 'bg-green-500' : 'bg-gray-400',
                    (f.isSpecial && f.isActive) ? 'opacity-40 cursor-not-allowed' : ''
                  ]"
                  class="px-2 py-1 text-white rounded text-xs"
                >
                  {{ f.isActive ? "Active" : "Inactive" }}
                </button>
              </td>

              <td>
                <button
                  @click="toggleSpecial(f)"
                  :disabled="!f.isActive"
                  :class="!f.isActive ? 'opacity-40 cursor-not-allowed' : ''"
                >
                  {{ f.isSpecial ? "⭐" : "☆" }}
                </button>
              </td>

              <td>
                <div class="flex flex-wrap justify-center gap-1">
                  <button @click="startEdit(f)" class="bg-blue-500 text-white px-2 py-1 rounded text-xs">Edit</button>
                  <button @click="remove(f._id)" class="bg-red-500 text-white px-2 py-1 rounded text-xs">Delete</button>
                </div>
              </td>

            </tr>
          </tbody>
        </table>

      </div>
    </div>

    <div class="flex flex-wrap justify-center gap-2">
      <button @click="page--; fetch()" :disabled="page===1">Prev</button>
      <button v-for="p in totalPages" :key="p" @click="page=p; fetch()"
        :class="page===p ? 'bg-black text-white px-2' : ''">
        {{ p }}
      </button>
      <button @click="page++; fetch()" :disabled="page===totalPages">Next</button>
    </div>

    <div v-if="showAddModal" class="fixed inset-0 bg-black/40 flex justify-center items-center p-4">
      <div class="bg-white p-6 rounded-xl w-full max-w-md space-y-2">

        <h3 class="font-semibold">Add Food</h3>

        <p v-if="formError" class="text-red-500 text-sm">{{ formError }}</p>

        <input v-model="form.name" class="border p-2 w-full" placeholder="Name" />
        <input v-model="form.price" class="border p-2 w-full" placeholder="Price" />

        <select v-model="form.category" class="border p-2 w-full">
          <option value="">Category</option>
          <option v-for="c in categories" :key="c._id" :value="c._id">
            {{ c.name }}
          </option>
        </select>

        <textarea v-model="form.notes" class="border p-2 w-full" placeholder="Notes"></textarea>

        <input type="file" @change="handleFile" class="w-full" />

        <div class="flex flex-col sm:flex-row justify-end gap-2">
          <button @click="showAddModal=false">Cancel</button>
          <button @click="add" class="bg-green-500 text-white px-3 py-1 rounded">Add</button>
        </div>

      </div>
    </div>

    <div v-if="editing" class="fixed inset-0 bg-black/40 flex justify-center items-center p-4">
      <div class="bg-white p-6 rounded-xl w-full max-w-md space-y-2">

        <h3 class="font-semibold">Edit Food</h3>

        <p v-if="formError" class="text-red-500 text-sm">{{ formError }}</p>

        <input v-model="editing.name" class="border p-2 w-full" />
        <input v-model="editing.price" class="border p-2 w-full" />

        <select v-model="editing.category" class="border p-2 w-full">
          <option v-for="c in categories" :key="c._id" :value="c._id">
            {{ c.name }}
          </option>
        </select>

        <textarea v-model="editing.notes" class="border p-2 w-full"></textarea>

        <input type="file" @change="handleEditFile" class="w-full" />

        <div class="flex flex-col sm:flex-row justify-end gap-2">
          <button @click="editing=null">Cancel</button>
          <button @click="update" class="bg-blue-500 text-white px-3 py-1 rounded">Update</button>
        </div>

      </div>
    </div>

    </template>
  </div>
</template>