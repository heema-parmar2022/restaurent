<template>
  <div class="bg-gray-50 min-h-screen">
    
    <nav class="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div class="max-w-5xl mx-auto px-4 flex items-center justify-between h-16">
        
        <router-link to="/" class="text-2xl font-black text-gray-900 uppercase">
          HP'S <span class="text-indigo-600 font-medium">Kitchen</span>
        </router-link>

        <div class="flex items-center gap-5 text-sm font-bold uppercase tracking-wide">
          
          <router-link 
            to="/" 
            class="text-gray-400 hover:text-indigo-600"
            active-class="text-indigo-600"
          >
            Menu
          </router-link>

          <router-link 
            to="/cart" 
            class="text-gray-400 hover:text-indigo-600"
            active-class="text-indigo-600"
          >
            Cart
          </router-link>

          <router-link 
            to="/status"
            class="px-4 py-2 rounded-lg border shadow-sm bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
            active-class="bg-indigo-600 text-white border-indigo-600 shadow-md"
          >
            Order Status
          </router-link>

        </div>
      </div>
    </nav>

    <!-- Page Content -->
    <main>
      <router-view />
    </main>
    
  </div>
</template>