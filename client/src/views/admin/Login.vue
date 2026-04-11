<script setup>
import { ref } from "vue";
import api from "../../api/api";
import { useRouter } from "vue-router";

const router = useRouter();

const form = ref({
  email: "",
  password: "",
});

const error = ref("");
const loading = ref(false);

const login = async () => {
  error.value = "";

  if (!form.value.email || !form.value.password) {
    error.value = "All fields required";
    return;
  }

  try {
    loading.value = true;

    const res = await api.post("/admin/login", form.value);

    localStorage.setItem("token", res.data.token);

    router.push("/admin/dashboard");
  } catch {
    error.value = "Invalid credentials";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 px-4">

    <div class="bg-white w-full max-w-md p-6 sm:p-8 rounded-2xl shadow-lg">

      <h2 class="text-2xl sm:text-3xl font-bold mb-6 text-center">
        Admin Login
      </h2>

      <input
        v-model="form.email"
        placeholder="Email"
        class="border border-gray-300 focus:border-black focus:ring-1 focus:ring-black p-3 w-full mb-4 rounded-lg outline-none transition"
      />

      <input
        v-model="form.password"
        type="password"
        placeholder="Password"
        class="border border-gray-300 focus:border-black focus:ring-1 focus:ring-black p-3 w-full mb-4 rounded-lg outline-none transition"
      />

      <button
        @click="login"
        :disabled="loading"
        class="bg-black hover:bg-gray-800 disabled:bg-gray-400 text-white w-full p-3 rounded-lg transition"
      >
        {{ loading ? "Logging..." : "Login" }}
      </button>

      <p v-if="error" class="text-red-500 mt-3 text-sm text-center">
        {{ error }}
      </p>

    </div>
  </div>
</template>