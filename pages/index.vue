<template>
  <div class="min-h-screen bg-gray-50">
    <!-- App Bar -->
    <header class="bg-white shadow-md">
      <div class="flex items-center gap-4 px-4 py-3">
        <!-- Menu Icon Button -->
        <button
          class="p-2 rounded-md hover:bg-gray-100 transition-colors"
          aria-label="Menu"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        <!-- Title -->
        <h1 class="text-xl font-semibold text-gray-900">
          Application Bar
        </h1>
      </div>
    </header>

    <!-- Main Content -->
    <main class="p-4">
      <h2 class="text-2xl font-bold mb-4">Hello World</h2>
    </main>
  </div>
</template>