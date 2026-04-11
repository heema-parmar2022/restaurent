<script setup>
import { ref } from "vue";
import Sidebar from "../components/admin/Sidebar.vue";
import Navbar from "../components/admin/Navbar.vue";

const isSidebarOpen = ref(false);
</script>

<template>
  <div class="flex min-h-screen bg-gray-100">

    <!-- Sidebar -->
    <Sidebar :isOpen="isSidebarOpen" @close="isSidebarOpen = false" />

    <!-- Main -->
    <div class="flex-1 flex flex-col">

      <!-- Navbar -->
      <Navbar @toggleSidebar="isSidebarOpen = true" />

      <!-- Content -->
      <div class="p-4 sm:p-6 flex-1 overflow-auto">
        <router-view />
      </div>

    </div>
  </div>
</template>