<template>
  <Teleport to="body">
    <div v-if="visible" class="fixed inset-0 z-[300] flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" @click="close"></div>
      <div class="bg-white w-full max-w-sm rounded-2xl shadow-2xl relative z-10 overflow-hidden">
        <div class="p-6 text-center">
          <!-- Icon -->
          <div class="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" :class="iconBg">
            <i :class="[icon, iconColor]" class="text-xl"></i>
          </div>

          <!-- Title -->
          <h3 class="text-base font-bold text-gray-900 mb-2">{{ title }}</h3>

          <!-- Message -->
          <p class="text-sm text-gray-500 mb-6">{{ message }}</p>

          <!-- Buttons -->
          <div class="flex gap-3 justify-center">
            <button
              v-if="showCancel"
              @click="close"
              class="px-5 py-2.5 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              v-if="showConfirm"
              @click="confirm"
              class="px-5 py-2.5 text-xs font-semibold text-white rounded-xl transition-colors shadow-lg"
              :class="confirmClass"
            >
              {{ confirmText }}
            </button>
            <button
              v-if="showOk"
              @click="close"
              class="px-5 py-2.5 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl transition-colors shadow-lg shadow-brand-600/20"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  visible: { type: Boolean, default: false },
  type: { type: String, default: 'confirm' }, // confirm | success | error | info
  title: { type: String, default: 'Are you sure?' },
  message: { type: String, default: '' },
  confirmText: { type: String, default: 'Confirm' },
  confirmDanger: { type: Boolean, default: false },
})

const emit = defineEmits(['confirm', 'close'])

const showCancel = computed(() => props.type === 'confirm')
const showConfirm = computed(() => props.type === 'confirm')
const showOk = computed(() => props.type !== 'confirm')

const icon = computed(() => {
  const map = { confirm: 'fas fa-question', success: 'fas fa-check', error: 'fas fa-times', info: 'fas fa-info-circle' }
  return map[props.type] || 'fas fa-info-circle'
})

const iconBg = computed(() => {
  const map = { confirm: 'bg-amber-100', success: 'bg-emerald-100', error: 'bg-red-100', info: 'bg-blue-100' }
  return map[props.type] || 'bg-blue-100'
})

const iconColor = computed(() => {
  const map = { confirm: 'text-amber-600', success: 'text-emerald-600', error: 'text-red-600', info: 'text-blue-600' }
  return map[props.type] || 'text-blue-600'
})

const confirmClass = computed(() => {
  return props.confirmDanger
    ? 'bg-red-600 hover:bg-red-700 shadow-red-600/20'
    : 'bg-brand-600 hover:bg-brand-700 shadow-brand-600/20'
})

function confirm() { emit('confirm') }
function close() { emit('close') }
</script>
