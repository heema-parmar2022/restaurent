<script setup>
import { useRouter } from "vue-router";

const emit = defineEmits(["toggleSidebar"]);
const router = useRouter();

const logout = () => {
  localStorage.removeItem("token");
  router.push("/admin/login");
};
</script>

<template>
  <div class="bg-white p-4 shadow flex items-center justify-between">

    <!-- Left -->
    <div class="flex items-center gap-3">
      <!-- Hamburger -->
      <button
        class="md:hidden text-xl"
        @click="emit('toggleSidebar')"
      >
        ☰
      </button>

      <h1 class="font-bold text-lg"> Dashboard</h1>
    </div>

    <!-- Right -->
    <button @click="logout" class="text-red-500 text-sm sm:text-base">
      Logout
    </button>
  </div>
</template>