<script setup lang="ts">
import AppHeader from '~/components/layouts/AppHeader.vue'

const props = defineProps({
  error: Object
})

const handleError = () => clearError({ redirect: '/' })
</script>

<template>
  <div class="error-wrapper">
    <!-- 頂部導航欄 (保持登入狀態顯示) -->
    <AppHeader class="error-header" />

    <div class="error-page">
      <!-- 背景流體裝飾 -->
      <div class="bg-decoration">
        <div class="blob blob-1"></div>
        <div class="blob blob-2"></div>
      </div>

    <div class="glass-container">
      <div class="content">
        <!-- ORCA 虎鯨動畫 (CSS 繪製) -->
        <div class="orca-visual">
          <div class="orca-body">
            <div class="fin"></div>
            <div class="eye"></div>
          </div>
          <div class="bubbles">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>

        <h1 class="error-code">404</h1>
        <h2 class="error-title">社交逃避成功</h2>
        <p class="error-message">
          你在這裡找到了絕對的安靜，但遺憾的是，這裡也沒有任何頁面。<br>
          在被發現之前，趕緊潛回深海吧。
        </p>

        <button class="back-home" @click="handleError">
          回到避風港
        </button>
      </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.error-wrapper {
  @apply min-h-[100dvh] flex flex-col;
}

.error-header {
  @apply fixed top-0 left-0 w-full z-50;
}

.error-page {
  @apply flex-grow w-full flex items-center justify-center overflow-hidden relative;
  background: radial-gradient(circle at center, #1a202c 0%, #0d1117 100%);
  font-family: 'Inter', sans-serif;
  padding-top: 80px; /* 為固定 Header 留出空間 */
}

/* === 背景裝飾 === */
.bg-decoration {
  @apply absolute inset-0 z-0 opacity-20 pointer-events-none;
}

.blob {
  @apply absolute rounded-full blur-[100px] animate-pulse;
}

.blob-1 {
  @apply w-[500px] h-[500px] bg-blue-500/30 -top-20 -left-20;
  animation-duration: 8s;
}

.blob-2 {
  @apply w-[400px] h-[400px] bg-indigo-500/30 -bottom-20 -right-20;
  animation-duration: 6s;
  animation-delay: 1s;
}

/* === 玻璃擬態容器 === */
.glass-container {
  @apply relative z-10 w-[90%] max-w-2xl px-8 py-12;
  @apply bg-white/5 border border-white/10 rounded-[2rem];
  backdrop-filter: blur(20px);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  transform: translateY(0);
  animation: float 6s ease-in-out infinite;
}

.content {
  @apply flex flex-col items-center text-center;
}

/* === ORCA 虎鯨動畫 === */
.orca-visual {
  @apply mb-8 relative;
}

.orca-body {
  @apply w-32 h-16 bg-white rounded-full relative overflow-hidden;
  @apply border-b-4 border-gray-900;
  animation: swim 3s ease-in-out infinite;
}

.orca-body::before {
  content: '';
  @apply absolute top-0 left-0 w-full h-1/2 bg-gray-900;
}

.fin {
  @apply absolute top-[-10px] left-1/2 w-8 h-8 bg-gray-900;
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
  transform: translateX(-50%) rotate(-20deg);
}

.eye {
  @apply absolute top-6 right-8 w-2 h-2 bg-gray-900 rounded-full;
  animation: blink 4s infinite;
}

.bubbles span {
  @apply absolute w-2 h-2 bg-white/40 rounded-full opacity-0;
  bottom: -20px;
}

.bubbles span:nth-child(1) { left: 20%; animation: bubble 2s infinite 0.2s; }
.bubbles span:nth-child(2) { left: 50%; animation: bubble 2.5s infinite 0.5s; }
.bubbles span:nth-child(3) { left: 80%; animation: bubble 1.8s infinite 0.8s; }

/* === 字體樣式 === */
.error-code {
  @apply text-8xl font-black text-white/10 mb-[-2rem] leading-none;
}

.error-title {
  @apply text-4xl font-black text-white mb-4 uppercase tracking-tighter;
  text-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}

.error-message {
  @apply text-gray-400 text-lg mb-10 max-w-md leading-relaxed;
}

/* === 按鈕樣式 === */
.back-home {
  @apply bg-white text-gray-900 font-bold px-10 py-4 rounded-full;
  @apply transition-all duration-300 transform;
  @apply hover:bg-blue-400 hover:text-white hover:scale-105 active:scale-95;
  box-shadow: 0 10px 20px -5px rgba(255, 255, 255, 0.2);
}

/* === 動畫定義 === */
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

@keyframes swim {
  0%, 100% { transform: rotate(0deg) translateX(0); }
  50% { transform: rotate(-5deg) translateX(-10px); }
}

@keyframes blink {
  0%, 95%, 100% { transform: scaleY(1); }
  97% { transform: scaleY(0.1); }
}

@keyframes bubble {
  0% { transform: translateY(0) scale(1); opacity: 0; }
  50% { opacity: 0.6; }
  100% { transform: translateY(-40px) scale(1.5); opacity: 0; }
}

/* 響應式微調 */
@media (max-width: 640px) {
  .error-code { @apply text-6xl; }
  .error-title { @apply text-3xl; }
  .error-message { @apply text-base; }
}
</style>
