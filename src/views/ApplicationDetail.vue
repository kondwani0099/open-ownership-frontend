<template>
  <div class="min-h-screen flex flex-col text-gray-900 bg-gray-50">
    <!-- Header -->
    <header class="bg-white/80 backdrop-blur-xl border-b border-gray-100/50 sticky top-0 z-[100]">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <AppLogo />
          <div class="w-px h-8 bg-gray-200 hidden sm:block"></div>
          <button @click="goBack" class="text-gray-400 hover:text-brand-600 transition-colors mr-1 p-1 rounded-lg">
            <i class="fas fa-arrow-left"></i>
          </button>
          <div>
            <div class="text-[10px] font-semibold text-gray-400 tracking-wider flex items-center gap-2">
              <i class="fas fa-file-alt text-brand-600"></i>
              <span>Application Detail</span>
            </div>
            <h1 class="text-lg font-bold text-gray-900">{{ application?.title || 'Loading...' }}</h1>
          </div>
        </div>
        <span class="text-xs font-medium text-gray-400">
          <i class="fas fa-circle text-emerald-400 text-[6px] mr-1"></i> {{ user?.email }}
        </span>
      </div>
    </header>

    <main class="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-8 pb-12 space-y-6">
      <div v-if="loading" class="flex flex-col items-center justify-center py-20">
        <div class="h-12 w-12 border-4 border-gray-100 border-t-brand-600 rounded-full animate-spin mb-4"></div>
        <p class="text-xs font-medium text-gray-400 animate-pulse">Loading Application...</p>
      </div>

      <div v-else-if="error" class="bg-red-50 border border-red-200 p-6 text-center">
        <p class="text-[11px] font-bold text-red-700 uppercase">{{ error }}</p>
        <button @click="goBack" class="mt-4 px-4 py-2 border border-red-300 text-[10px] font-bold text-red-600 uppercase hover:bg-red-100 transition-colors">Go Back</button>
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left: Application Info -->
        <div class="lg:col-span-2 space-y-6">
          <div class="bg-white border border-gray-100 shadow-sm p-6 space-y-4">
            <div class="flex items-center justify-between">
              <h2 class="text-[11px] font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                <span class="w-2 h-2 bg-blue-600"></span> Application Details
              </h2>
              <span :class="statusBadgeClass(application?.status)" class="text-[9px] font-black px-3 py-1 border uppercase font-mono">
                {{ application?.status?.replace(/_/g, ' ') }}
              </span>
            </div>

            <div class="grid grid-cols-2 gap-4 pt-2">
              <div>
                <span class="text-[8px] font-black text-gray-400 uppercase tracking-widest block mb-1">Title</span>
                <span class="text-[11px] font-bold text-gray-900 uppercase">{{ application?.title }}</span>
              </div>
              <div>
                <span class="text-[8px] font-black text-gray-400 uppercase tracking-widest block mb-1">Category</span>
                <span class="text-[10px] font-bold text-gray-600 uppercase">{{ application?.category }}</span>
              </div>
              <div>
                <span class="text-[8px] font-black text-gray-400 uppercase tracking-widest block mb-1">Amount</span>
                <span class="text-[14px] font-black text-gray-900 font-mono">K{{ formatAmount(application?.amount) }}</span>
              </div>
              <div>
                <span class="text-[8px] font-black text-gray-400 uppercase tracking-widest block mb-1">Applicant</span>
                <span class="text-[10px] text-gray-700 font-mono">{{ application?.applicant_id }}</span>
              </div>
            </div>

            <div class="pt-2">
              <span class="text-[8px] font-black text-gray-400 uppercase tracking-widest block mb-1">Description</span>
              <p class="text-[10px] text-gray-600 font-mono bg-gray-50 p-3 border border-gray-100">{{ application?.description || 'No description provided.' }}</p>
            </div>

            <div class="grid grid-cols-2 gap-4 pt-2 border-t border-gray-100">
              <div>
                <span class="text-[8px] font-black text-gray-400 uppercase tracking-widest block mb-1">Created</span>
                <span class="text-[9px] text-gray-500 font-mono">{{ formatDateTime(application?.created_at) }}</span>
              </div>
              <div>
                <span class="text-[8px] font-black text-gray-400 uppercase tracking-widest block mb-1">Updated</span>
                <span class="text-[9px] text-gray-500 font-mono">{{ formatDateTime(application?.updated_at) }}</span>
              </div>
            </div>

            <!-- Reviewer comment if any -->
            <div v-if="application?.reviewer_comment" class="pt-2 border-t border-gray-100">
              <span class="text-[8px] font-black text-gray-400 uppercase tracking-widest block mb-1">Reviewer Comment</span>
              <div class="bg-blue-50 border border-blue-100 p-3 text-[10px] font-mono text-blue-700">
                <i class="fas fa-comment mr-1"></i> {{ application?.reviewer_comment }}
              </div>
            </div>
          </div>

          <!-- Reviewer Actions (only for reviewers) -->
          <div v-if="user?.role === 'reviewer' && canReview" class="bg-white border border-gray-100 shadow-sm p-6 space-y-4">
            <h2 class="text-[11px] font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
              <span class="w-2 h-2 bg-emerald-600"></span> Reviewer Actions
            </h2>

            <div class="grid grid-cols-3 gap-3">
              <button
                v-if="application?.status === 'SUBMITTED'"
                @click="executeAction('review')"
                :disabled="actionLoading"
                class="border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 py-3 text-[9px] font-bold font-mono uppercase tracking-wider transition-colors disabled:opacity-50"
              >
                <i class="fas fa-search block mb-1"></i> Take Review
              </button>
              <button
                v-if="application?.status === 'UNDER_REVIEW'"
                @click="prepareAction('approve')"
                :disabled="actionLoading"
                class="border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 py-3 text-[9px] font-bold font-mono uppercase tracking-wider transition-colors disabled:opacity-50"
              >
                <i class="fas fa-check block mb-1"></i> Approve
              </button>
              <button
                v-if="application?.status === 'UNDER_REVIEW'"
                @click="prepareAction('reject')"
                :disabled="actionLoading"
                class="border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 py-3 text-[9px] font-bold font-mono uppercase tracking-wider transition-colors disabled:opacity-50"
              >
                <i class="fas fa-times block mb-1"></i> Reject
              </button>
              <button
                v-if="application?.status === 'SUBMITTED'"
                @click="prepareAction('return')"
                :disabled="actionLoading"
                class="border border-purple-200 bg-purple-50 hover:bg-purple-100 text-purple-700 py-3 text-[9px] font-bold font-mono uppercase tracking-wider transition-colors disabled:opacity-50"
              >
                <i class="fas fa-undo block mb-1"></i> Return
              </button>
            </div>

            <!-- Comment input for reject/return -->
            <div v-if="showCommentInput" class="space-y-2">
              <label class="block text-[9px] font-bold text-gray-500 uppercase tracking-wider">
                Comment <span class="text-red-500">*</span>
              </label>
              <textarea v-model="actionComment" rows="3" class="w-full bg-gray-50 border border-gray-200 text-[11px] font-mono focus:border-emerald-600 focus:ring-0" placeholder="Required for this action..."></textarea>
              <div class="flex gap-2">
                <button @click="confirmAction" :disabled="actionLoading" class="px-4 py-2 bg-emerald-600 text-white text-[9px] font-bold font-mono uppercase hover:bg-emerald-700 transition-colors disabled:opacity-50">
                  {{ actionLoading ? 'PROCESSING...' : 'CONFIRM' }}
                </button>
                <button @click="cancelAction" class="px-4 py-2 border border-gray-200 text-[9px] font-bold font-mono text-gray-500 uppercase hover:bg-gray-100 transition-colors">Cancel</button>
              </div>
            </div>

            <div v-if="actionError" class="bg-red-50 border border-red-200 px-4 py-2 text-[9px] font-bold text-red-700 uppercase">{{ actionError }}</div>
            <div v-if="actionSuccess" class="bg-emerald-50 border border-emerald-200 px-4 py-2 text-[9px] font-bold text-emerald-700 uppercase">{{ actionSuccess }}</div>
          </div>

          <!-- Applicant: Submit button -->
          <div v-if="user?.role === 'applicant' && application?.status === 'DRAFT'" class="bg-white border border-gray-100 shadow-sm p-6">
            <button @click="executeAction('submit')" :disabled="actionLoading" class="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-[10px] font-bold font-mono uppercase tracking-widest transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              <i class="fas fa-paper-plane"></i> {{ actionLoading ? 'SUBMITTING...' : 'Submit for Review' }}
            </button>
            <div v-if="actionError" class="bg-red-50 border border-red-200 px-4 py-2 mt-3 text-[9px] font-bold text-red-700 uppercase">{{ actionError }}</div>
          </div>
        </div>

        <!-- Right: Audit Trail -->
        <div class="space-y-6">
          <div class="bg-white border border-gray-100 shadow-sm p-6">
            <h2 class="text-[11px] font-black text-gray-900 uppercase tracking-widest flex items-center gap-2 mb-4">
              <span class="w-2 h-2 bg-purple-600"></span> Audit Trail
            </h2>

            <div v-if="auditLogs.length === 0" class="text-center py-8">
              <p class="text-[9px] text-gray-400 uppercase tracking-widest italic font-mono">No entries yet</p>
            </div>

            <div class="space-y-3">
              <div v-for="(entry, i) in auditLogs" :key="i" class="border-l-2 border-gray-200 pl-4 py-2 relative">
                <div class="absolute left-[-5px] top-4 w-2 h-2 rounded-full bg-gray-300"></div>
                <div class="flex items-center gap-2 mb-1">
                  <span class="text-[8px] font-black text-gray-400 uppercase tracking-wider">{{ formatDateTime(entry.timestamp) }}</span>
                </div>
                <div class="flex items-center gap-2 mb-1">
                  <span :class="entry.performer_role === 'reviewer' ? 'text-emerald-600' : 'text-blue-600'" class="text-[9px] font-bold font-mono uppercase">
                    <i :class="entry.performer_role === 'reviewer' ? 'fas fa-check-double' : 'fas fa-user'"></i>
                    {{ entry.performed_by }}
                  </span>
                  <span class="text-[8px] text-gray-400">({{ entry.performer_role }})</span>
                </div>
                <p class="text-[9px] font-bold font-mono uppercase tracking-wider">
                  <span class="text-gray-400">{{ entry.old_status || 'START' }}</span>
                  <i class="fas fa-arrow-right mx-1 text-gray-300 text-[8px]"></i>
                  <span :class="statusTextColor(entry.new_status)">{{ entry.new_status }}</span>
                </p>
                <p v-if="entry.comment" class="text-[9px] text-gray-500 italic mt-1 font-mono">"{{ entry.comment }}"</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getApplicationDetail, transitionApplication } from '@/api_services/api'
import AppLogo from '@/components/AppLogo.vue'

const route = useRoute()
const router = useRouter()
const user = ref(JSON.parse(localStorage.getItem('user') || '{}'))
const loading = ref(false)
const error = ref('')
const application = ref(null)
const auditLogs = ref([])

// Action state
const actionLoading = ref(false)
const actionError = ref('')
const actionSuccess = ref('')
const pendingAction = ref('')
const showCommentInput = ref(false)
const actionComment = ref('')

const canReview = computed(() => {
  const status = application.value?.status
  return status === 'SUBMITTED' || status === 'UNDER_REVIEW'
})

function statusBadgeClass(status) {
  const map = {
    DRAFT: 'border-gray-200 bg-gray-50 text-gray-500',
    SUBMITTED: 'border-amber-200 bg-amber-50 text-amber-600',
    UNDER_REVIEW: 'border-blue-200 bg-blue-50 text-blue-600',
    APPROVED: 'border-emerald-200 bg-emerald-50 text-emerald-600',
    REJECTED: 'border-red-200 bg-red-50 text-red-600',
    RETURNED_FOR_CHANGES: 'border-purple-200 bg-purple-50 text-purple-600',
  }
  return map[status] || 'border-gray-200 bg-gray-50 text-gray-500'
}

function statusTextColor(status) {
  const map = {
    DRAFT: 'text-gray-500',
    SUBMITTED: 'text-amber-600',
    UNDER_REVIEW: 'text-blue-600',
    APPROVED: 'text-emerald-600',
    REJECTED: 'text-red-600',
    RETURNED_FOR_CHANGES: 'text-purple-600',
  }
  return map[status] || 'text-gray-500'
}

function formatAmount(n) {
  return Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function formatDateTime(d) {
  if (!d) return '—'
  return new Date(d).toLocaleString('en-ZM', {
    day: '2-digit', month: 'short', year: '2-digit',
    hour: '2-digit', minute: '2-digit'
  }).toUpperCase()
}

async function fetchDetail() {
  loading.value = true
  error.value = ''
  try {
    const res = await getApplicationDetail(route.params.id)
    application.value = res.data.application
    auditLogs.value = res.data.audit_logs || []
  } catch (e) {
    error.value = e.response?.data?.detail || 'Failed to load application'
  } finally {
    loading.value = false
  }
}

function prepareAction(action) {
  pendingAction.value = action
  actionComment.value = ''
  actionError.value = ''
  actionSuccess.value = ''
  if (action === 'reject' || action === 'return') {
    showCommentInput.value = true
  } else {
    confirmAction()
  }
}

async function executeAction(action) {
  pendingAction.value = action
  if (action === 'reject' || action === 'return') {
    prepareAction(action)
    return
  }
  confirmAction()
}

async function confirmAction() {
  const action = pendingAction.value
  if ((action === 'reject' || action === 'return') && !actionComment.value.trim()) {
    actionError.value = 'A comment is required for this action'
    return
  }
  actionLoading.value = true
  actionError.value = ''
  actionSuccess.value = ''
  try {
    await transitionApplication(route.params.id, action, actionComment.value)
    actionSuccess.value = `Application ${action === 'review' ? 'taken under review' : action + 'ed'} successfully.`
    showCommentInput.value = false
    actionComment.value = ''
    pendingAction.value = ''
    await fetchDetail()
  } catch (e) {
    actionError.value = e.response?.data?.detail || 'Action failed'
  } finally {
    actionLoading.value = false
  }
}

function cancelAction() {
  showCommentInput.value = false
  pendingAction.value = ''
  actionComment.value = ''
  actionError.value = ''
}

function goBack() {
  const role = user.value?.role
  router.push(role === 'reviewer' ? '/reviewer' : '/applicant')
}

onMounted(() => fetchDetail())
</script>
