<template>
  <div class="min-h-screen flex flex-col text-gray-900 bg-gray-50">
    <!-- Header -->
    <header class="bg-white/80 backdrop-blur-xl border-b border-gray-100/50 sticky top-0 z-[100]">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <AppLogo />
          <div class="w-px h-8 bg-gray-200 hidden sm:block"></div>
          <div>
            <div class="text-[10px] font-semibold text-gray-400 tracking-wider flex items-center gap-2">
              <i class="fas fa-clipboard-check text-emerald-600"></i>
              <span>Review Queue</span>
            </div>
            <h1 class="text-lg font-bold text-gray-900">{{ user?.name || 'Review Queue' }}</h1>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <NotificationBell />
          <span class="hidden md:inline text-xs font-medium text-gray-400">
            <i class="fas fa-circle text-emerald-400 text-[6px] mr-1"></i> {{ user?.email }}
          </span>
          <button @click="logout" class="text-xs font-medium text-gray-400 hover:text-red-500 transition-colors">
            <i class="fas fa-sign-out-alt mr-1"></i> Logout
          </button>
        </div>
      </div>
    </header>

    <!-- Main -->
    <main class="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-8 pb-12 space-y-6">
      <div v-if="loading" class="flex flex-col items-center justify-center py-20">
        <div class="h-12 w-12 border-4 border-gray-100 border-t-emerald-600 rounded-full animate-spin mb-4"></div>
        <p class="text-xs font-medium text-gray-400 animate-pulse">Loading Queue...</p>
      </div>

      <div v-else class="space-y-6">
        <!-- KPI Cards -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div v-for="card in kpiCards" :key="card.label" class="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-lg transition-shadow">
            <div class="flex items-center gap-3 mb-3">
              <div class="w-10 h-10 rounded-xl flex items-center justify-center" :class="card.bg">
                <i :class="[card.icon, card.color]" class="text-sm"></i>
              </div>
              <span class="text-[10px] font-semibold text-gray-400 tracking-wider">{{ card.label }}</span>
            </div>
            <p class="text-2xl font-extrabold text-gray-900">{{ card.value }}</p>
          </div>
        </div>

        <!-- Filters -->
        <div class="bg-white border border-gray-100 rounded-2xl p-5">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="text-[10px] font-semibold text-gray-400 tracking-wider mb-1.5 block">Status</label>
              <select v-model="statusFilter" class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-xs font-medium focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500">
                <option value="">All Statuses</option>
                <option value="SUBMITTED">Submitted</option>
                <option value="UNDER_REVIEW">Under Review</option>
                <option value="RETURNED_FOR_CHANGES">Returned</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
            <div class="md:col-span-2">
              <label class="text-[10px] font-semibold text-gray-400 tracking-wider mb-1.5 block">Search</label>
              <input v-model="searchQuery" type="text" placeholder="Search by title, description, or applicant..." class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500">
            </div>
          </div>
        </div>

        <!-- Queue Table -->
        <div class="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="bg-gray-50/50 border-b border-gray-100">
                  <th class="py-3.5 px-5 text-left text-[10px] font-semibold text-gray-400 tracking-wider">Title</th>
                  <th class="py-3.5 px-5 text-left text-[10px] font-semibold text-gray-400 tracking-wider">Applicant</th>
                  <th class="py-3.5 px-5 text-left text-[10px] font-semibold text-gray-400 tracking-wider">Cat</th>
                  <th class="py-3.5 px-5 text-right text-[10px] font-semibold text-gray-400 tracking-wider">Amount</th>
                  <th class="py-3.5 px-5 text-center text-[10px] font-semibold text-gray-400 tracking-wider">Status</th>
                  <th class="py-3.5 px-5 text-right text-[10px] font-semibold text-gray-400 tracking-wider">Updated</th>
                  <th class="py-3.5 px-5 text-right text-[10px] font-semibold text-gray-400 tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-50">
                <tr v-for="app in paginatedApps" :key="app.id" class="hover:bg-gray-50/50 transition-colors">
                  <td class="py-3.5 px-5 text-sm font-semibold text-gray-900">{{ app.title }}</td>
                  <td class="py-3.5 px-5 text-xs text-gray-500">{{ app.applicant_id }}</td>
                  <td class="py-3.5 px-5 text-xs font-medium text-gray-500">{{ app.category }}</td>
                  <td class="py-3.5 px-5 text-right text-sm font-bold text-gray-900">{{ formatAmount(app.amount) }}</td>
                  <td class="py-3.5 px-5 text-center">
                    <span :class="statusBadgeClass(app.status)" class="text-[10px] font-semibold px-3 py-1 rounded-full">
                      {{ app.status.replace(/_/g, ' ') }}
                    </span>
                  </td>
                  <td class="py-3.5 px-5 text-right text-xs text-gray-400">{{ formatDate(app.updated_at) }}</td>
                  <td class="py-3.5 px-5 text-right">
                    <div class="flex items-center justify-end gap-1.5">
                      <button v-if="app.status === 'SUBMITTED'" @click="quickAction(app.id, 'review')" class="px-3 py-1.5 text-[10px] font-semibold text-brand-600 bg-brand-50 hover:bg-brand-100 rounded-lg transition-colors">
                        Take Review
                      </button>
                      <button @click="viewDetail(app.id)" class="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="View">
                        <i class="fas fa-eye text-xs"></i>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="filteredApps.length === 0">
                  <td colspan="7" class="py-16 text-center text-sm text-gray-400 font-medium">Queue is empty</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-if="filteredApps.length > 0" class="px-5 py-3 border-t border-gray-100 flex justify-between items-center bg-gray-50/30">
            <div class="text-xs text-gray-400 font-medium">Showing {{ startIdx }}-{{ endIdx }} of {{ filteredApps.length }}</div>
            <div class="flex gap-2">
              <button @click="page--" :disabled="page === 1" class="px-3 py-1.5 border border-gray-200 text-xs font-semibold rounded-lg disabled:opacity-30 hover:bg-white transition-colors">Prev</button>
              <span class="px-3 py-1.5 text-xs font-bold text-brand-600">{{ page }} / {{ totalPages }}</span>
              <button @click="page++" :disabled="page >= totalPages" class="px-3 py-1.5 border border-gray-200 text-xs font-semibold rounded-lg disabled:opacity-30 hover:bg-white transition-colors">Next</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Review Action Modal -->
      <div v-if="showReviewModal" class="fixed inset-0 z-[200] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" @click="showReviewModal = false"></div>
        <div class="bg-white w-full max-w-xl rounded-2xl shadow-2xl relative z-10 overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h3 class="text-sm font-bold text-gray-900 flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-emerald-600"></span>
              Review Application
            </h3>
            <button @click="showReviewModal = false" class="text-gray-400 hover:text-red-500 transition-colors p-1">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="p-6 space-y-4">
            <div class="bg-gray-50 border border-gray-100 rounded-xl p-4 space-y-2">
              <div class="flex justify-between text-sm"><span class="text-gray-400 font-medium">Title</span><span class="font-semibold text-gray-900">{{ reviewTarget?.title }}</span></div>
              <div class="flex justify-between text-sm"><span class="text-gray-400 font-medium">Applicant</span><span class="text-gray-700">{{ reviewTarget?.applicant_id }}</span></div>
              <div class="flex justify-between text-sm"><span class="text-gray-400 font-medium">Amount</span><span class="font-bold text-gray-900">{{ formatAmount(reviewTarget?.amount) }}</span></div>
              <div class="flex justify-between text-sm"><span class="text-gray-400 font-medium">Status</span><span :class="statusBadgeClass(reviewTarget?.status)" class="text-[10px] font-semibold px-3 py-1 rounded-full">{{ reviewTarget?.status?.replace(/_/g, ' ') }}</span></div>
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-600 mb-2">Action</label>
              <div class="grid grid-cols-3 gap-2">
                <button v-if="reviewTarget?.status === 'SUBMITTED'" @click="reviewAction = 'review'" :class="reviewAction === 'review' ? 'bg-brand-600 text-white' : 'border-gray-200 text-gray-500 hover:border-brand-300'" class="border px-3 py-2.5 text-xs font-semibold rounded-xl transition-colors"><i class="fas fa-search mr-1"></i> Review</button>
                <button v-if="reviewTarget?.status === 'UNDER_REVIEW'" @click="reviewAction = 'approve'" :class="reviewAction === 'approve' ? 'bg-emerald-600 text-white' : 'border-gray-200 text-gray-500 hover:border-emerald-300'" class="border px-3 py-2.5 text-xs font-semibold rounded-xl transition-colors"><i class="fas fa-check mr-1"></i> Approve</button>
                <button v-if="reviewTarget?.status === 'UNDER_REVIEW'" @click="reviewAction = 'reject'" :class="reviewAction === 'reject' ? 'bg-red-600 text-white' : 'border-gray-200 text-gray-500 hover:border-red-300'" class="border px-3 py-2.5 text-xs font-semibold rounded-xl transition-colors"><i class="fas fa-times mr-1"></i> Reject</button>
                <button v-if="reviewTarget?.status === 'SUBMITTED'" @click="reviewAction = 'return'" :class="reviewAction === 'return' ? 'bg-purple-600 text-white' : 'border-gray-200 text-gray-500 hover:border-purple-300'" class="border px-3 py-2.5 text-xs font-semibold rounded-xl transition-colors"><i class="fas fa-undo mr-1"></i> Return</button>
              </div>
            </div>
            <div v-if="reviewAction === 'reject' || reviewAction === 'return'">
              <label class="block text-xs font-semibold text-gray-600 mb-1.5">Comment <span class="text-red-500">*</span></label>
              <textarea v-model="reviewComment" rows="3" class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500" placeholder="Required for reject / return..."></textarea>
            </div>
            <div v-if="reviewAction && reviewAction !== 'reject' && reviewAction !== 'return'">
              <label class="block text-xs font-semibold text-gray-600 mb-1.5">Comment (optional)</label>
              <textarea v-model="reviewComment" rows="2" class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500" placeholder="Optional feedback..."></textarea>
            </div>
            <div v-if="actionError" class="bg-red-50 border border-red-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-red-700">{{ actionError }}</div>
          </div>
          <div class="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
            <button @click="showReviewModal = false" class="px-5 py-2.5 text-xs font-semibold text-gray-600 hover:bg-gray-200 rounded-xl transition-colors">Cancel</button>
            <button @click="executeReview" :disabled="!reviewAction || actionLoading" class="px-6 py-2.5 bg-brand-600 text-white text-xs font-semibold rounded-xl hover:bg-brand-700 transition-colors disabled:opacity-50 shadow-lg shadow-brand-600/20">
              {{ actionLoading ? 'Processing...' : 'Confirm' }}
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
               

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { listReviewQueue, transitionApplication } from '@/api_services/api'
import AppLogo from '@/components/AppLogo.vue'
import NotificationBell from '@/components/NotificationBell.vue'

const router = useRouter()
const user = ref(JSON.parse(localStorage.getItem('user') || '{}'))
const loading = ref(false)
const applications = ref([])
const statusFilter = ref('')
const searchQuery = ref('')
const page = ref(1)
const perPage = 25

// Review modal
const showReviewModal = ref(false)
const reviewTarget = ref(null)
const reviewAction = ref('')
const reviewComment = ref('')
const actionLoading = ref(false)
const actionError = ref('')

const filteredApps = computed(() => {
  let res = [...applications.value]
  if (statusFilter.value) res = res.filter(a => a.status === statusFilter.value)
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    res = res.filter(a =>
      (a.title || '').toLowerCase().includes(q) ||
      (a.description || '').toLowerCase().includes(q) ||
      (a.applicant_id || '').toLowerCase().includes(q)
    )
  }
  res.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
  return res
})

const totalPages = computed(() => Math.ceil(filteredApps.value.length / perPage) || 1)
const paginatedApps = computed(() => filteredApps.value.slice((page.value - 1) * perPage, page.value * perPage))
const startIdx = computed(() => (page.value - 1) * perPage + 1)
const endIdx = computed(() => Math.min(page.value * perPage, filteredApps.value.length))

const kpiCards = computed(() => [
  { label: 'Total', icon: 'fas fa-inbox', color: 'text-brand-600', bg: 'bg-brand-50', value: applications.value.length },
  { label: 'Pending', icon: 'fas fa-clock', color: 'text-amber-600', bg: 'bg-amber-50', value: applications.value.filter(a => a.status === 'SUBMITTED').length },
  { label: 'In Review', icon: 'fas fa-search', color: 'text-blue-600', bg: 'bg-blue-50', value: applications.value.filter(a => a.status === 'UNDER_REVIEW').length },
  { label: 'Decided', icon: 'fas fa-gavel', color: 'text-purple-600', bg: 'bg-purple-50', value: applications.value.filter(a => a.status === 'APPROVED' || a.status === 'REJECTED').length },
])

function statusBadgeClass(status) {
  const map = {
    DRAFT: 'bg-gray-100 text-gray-600',
    SUBMITTED: 'bg-amber-100 text-amber-700',
    UNDER_REVIEW: 'bg-blue-100 text-blue-700',
    APPROVED: 'bg-emerald-100 text-emerald-700',
    REJECTED: 'bg-red-100 text-red-700',
    RETURNED_FOR_CHANGES: 'bg-purple-100 text-purple-700',
  }
  return map[status] || 'bg-gray-100 text-gray-600'
}

function formatAmount(n) {
  return Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function formatDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-ZM', { day: '2-digit', month: 'short', year: '2-digit' }).toUpperCase()
}

async function fetchQueue() {
  loading.value = true
  try {
    const params = { limit: 200 }
    if (statusFilter.value) params.status = statusFilter.value
    if (searchQuery.value) params.search = searchQuery.value
    const res = await listReviewQueue(params)
    applications.value = res.data.applications || []
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

let searchTimeout
watch([statusFilter, searchQuery], () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    page.value = 1
    fetchQueue()
  }, 300)
})

function quickAction(id, action) {
  const app = applications.value.find(a => a.id === id)
  if (!app) return
  reviewTarget.value = app
  reviewAction.value = action
  reviewComment.value = ''
  actionError.value = ''
  showReviewModal.value = true
}

async function executeReview() {
  actionError.value = ''
  if ((reviewAction.value === 'reject' || reviewAction.value === 'return') && !reviewComment.value.trim()) {
    actionError.value = 'A comment is required for this action'
    return
  }
  actionLoading.value = true
  try {
    await transitionApplication(reviewTarget.value.id, reviewAction.value, reviewComment.value)
    showReviewModal.value = false
    reviewTarget.value = null
    reviewAction.value = ''
    reviewComment.value = ''
    await fetchQueue()
  } catch (e) {
    actionError.value = e.response?.data?.detail || 'Action failed'
  } finally {
    actionLoading.value = false
  }
}

function viewDetail(id) {
  router.push(`/applications/${id}`)
}

function logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  router.push('/login')
}

onMounted(() => fetchQueue())
</script>
