<template>
  <div class="flex items-center gap-3 select-none">
    <img
      src="@/assets/logo.png"
      alt="Open Ownership"
      class="h-10 w-10 flex-shrink-0"
    />
    <span class="text-sm font-black uppercase tracking-widest">
      <span class="text-brand-600">Open</span>
      <span :class="dark ? 'text-white' : 'text-gray-900'"> Ownership</span>
    </span>
  </div>
</template>

<script setup>
defineProps({
  dark: { type: Boolean, default: false }
})
</script>
