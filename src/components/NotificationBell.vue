<template>
  <div class="relative">
    <button
      @click="toggleDropdown"
      class="relative p-2 text-gray-400 hover:text-gray-600 transition-colors"
      title="Notifications"
    >
      <i class="fas fa-bell text-lg"></i>
      <span
        v-if="unreadCount > 0"
        class="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[8px] font-black w-4 h-4 flex items-center justify-center rounded-full leading-none"
      >
        {{ unreadCount > 9 ? '9+' : unreadCount }}
      </span>
    </button>

    <!-- Dropdown -->
    <div
      v-if="open"
      class="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 shadow-xl z-50"
      @click.stop
    >
      <div class="px-4 py-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
        <span class="text-[9px] font-black text-gray-400 uppercase tracking-widest">
          Notifications
        </span>
        <button
          v-if="unreadCount > 0"
          @click="markAllRead"
          class="text-[8px] font-bold text-brand-600 hover:text-brand-700 uppercase tracking-wider"
        >
          Mark all read
        </button>
      </div>

      <div class="max-h-80 overflow-y-auto">
        <div v-if="notifications.length === 0" class="px-4 py-8 text-center">
          <i class="fas fa-bell-slash text-gray-200 text-2xl mb-2 block"></i>
          <p class="text-[9px] text-gray-400 uppercase tracking-wider">No notifications yet</p>
        </div>

        <div
          v-for="n in notifications"
          :key="n.id"
          class="px-4 py-3 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors"
          @click="goToApplication(n.application_id)"
        >
          <div class="flex items-start gap-2">
            <div :class="iconClass(n)" class="w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
              <i :class="iconFor(n)" class="text-[8px]"></i>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-[9px] font-bold text-gray-900 uppercase leading-tight truncate">
                {{ n.application_title }}
              </p>
              <p class="text-[8px] text-gray-500 mt-0.5 uppercase">
                <span :class="statusColor(n.new_status)">{{ n.new_status.replace(/_/g, ' ') }}</span>
                <span v-if="n.comment" class="text-gray-400"> — "{{ n.comment.slice(0, 60) }}{{ n.comment.length > 60 ? '...' : '' }}"</span>
              </p>
              <p class="text-[7px] text-gray-300 mt-1 font-mono">{{ formatTime(n.timestamp) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Click-outside overlay -->
    <div v-if="open" class="fixed inset-0 z-40" @click="open = false"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { getNotifications, markNotificationsRead } from '@/api_services/api'

const router = useRouter()
const open = ref(false)
const notifications = ref([])
const unreadCount = ref(0)
let pollTimer = null

onMounted(() => {
  fetchNotifications()
  pollTimer = setInterval(fetchNotifications, 30000)
})

onUnmounted(() => {
  clearInterval(pollTimer)
})

async function fetchNotifications() {
  try {
    const res = await getNotifications({ limit: 20 })
    notifications.value = res.data.notifications || []
    unreadCount.value = res.data.unread || 0
  } catch (e) {
    // Silent fail
  }
}

function toggleDropdown() {
  open.value = !open.value
  if (open.value) fetchNotifications()
}

async function markAllRead() {
  try {
    await markNotificationsRead()
    unreadCount.value = 0
  } catch (_) { /* ignore */ }
}

function goToApplication(id) {
  open.value = false
  router.push(`/applications/${id}`)
}

function iconFor(n) {
  const map = {
    SUBMITTED: 'fas fa-paper-plane',
    UNDER_REVIEW: 'fas fa-search',
    APPROVED: 'fas fa-check',
    REJECTED: 'fas fa-times',
    RETURNED_FOR_CHANGES: 'fas fa-undo',
    DRAFT: 'fas fa-pencil-alt',
  }
  return map[n.new_status] || 'fas fa-circle'
}

function iconClass(n) {
  const map = {
    SUBMITTED: 'bg-amber-100 text-amber-600',
    APPROVED: 'bg-emerald-100 text-emerald-600',
    REJECTED: 'bg-red-100 text-red-600',
    RETURNED_FOR_CHANGES: 'bg-purple-100 text-purple-600',
    UNDER_REVIEW: 'bg-blue-100 text-blue-600',
  }
  return map[n.new_status] || 'bg-gray-100 text-gray-500'
}

function statusColor(status) {
  const map = {
    SUBMITTED: 'text-amber-600',
    APPROVED: 'text-emerald-600 font-black',
    REJECTED: 'text-red-600 font-black',
    RETURNED_FOR_CHANGES: 'text-purple-600',
    UNDER_REVIEW: 'text-blue-600',
  }
  return map[status] || 'text-gray-500'
}

function formatTime(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  const now = new Date()
  const diff = now - d
  if (diff < 60000) return 'Just now'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
  return d.toLocaleDateString('en-ZM', { day: '2-digit', month: 'short' }).toUpperCase()
}
</script>
