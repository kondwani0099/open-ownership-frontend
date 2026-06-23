<template>
  <div class="min-h-screen flex flex-col font-mono relative text-gray-900 bg-gray-50">
    <div class="fixed inset-0 z-0 pointer-events-none mesh-background"></div>

    <!-- Header -->
    <header class="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-[100] shadow-sm">
      <div class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-1.5 h-8 bg-emerald-600"></div>
          <div>
            <div class="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <i class="fas fa-clipboard-check text-emerald-600"></i>
              <span>Reviewer // Queue</span>
            </div>
            <h1 class="text-xl font-black text-gray-900 uppercase tracking-tight font-display">{{ user?.name || 'Review Queue' }}</h1>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <span class="hidden md:inline text-[9px] font-bold text-gray-400 uppercase tracking-wider">
            <i class="fas fa-circle text-emerald-400 text-[6px] mr-1"></i> {{ user?.email }}
          </span>
          <button @click="logout" class="text-[10px] font-bold font-mono text-gray-400 hover:text-red-600 uppercase tracking-wider transition-colors">
            <i class="fas fa-sign-out-alt mr-1"></i> Logout
          </button>
        </div>
      </div>
    </header>

    <!-- Main -->
    <main class="flex-1 max-w-[1600px] mx-auto w-full px-4 sm:px-6 lg:px-8 pt-8 pb-12 relative z-10 space-y-6">
      <div v-if="loading" class="flex flex-col items-center justify-center py-20">
        <div class="h-12 w-12 border-4 border-gray-100 border-t-emerald-600 rounded-full animate-spin shadow-lg mb-4"></div>
        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest animate-pulse">Loading Queue...</p>
      </div>

      <div v-else class="space-y-6">
        <!-- KPI Cards -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="bg-white border border-gray-100 shadow-sm p-4" v-for="card in kpiCards" :key="card.label">
            <div class="flex items-center gap-2 mb-3">
              <div class="w-8 h-8 bg-gray-100 flex items-center justify-center">
                <i :class="[card.icon, card.color]" class="text-xs"></i>
              </div>
              <span class="text-[8px] font-black text-gray-400 uppercase tracking-widest">{{ card.label }}</span>
            </div>
            <p class="text-lg font-black text-gray-900 font-display tracking-tight">{{ card.value }}</p>
          </div>
        </div>

        <!-- Filters -->
        <div class="bg-white border border-gray-100 p-4 shadow-sm">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Status</label>
              <select v-model="statusFilter" class="w-full rounded-none border border-gray-200 px-4 py-2 text-[10px] font-bold font-mono focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 uppercase">
                <option value="">All Active</option>
                <option value="SUBMITTED">Submitted</option>
                <option value="UNDER_REVIEW">Under Review</option>
                <option value="RETURNED_FOR_CHANGES">Returned</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
            <div class="md:col-span-2">
              <label class="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Search</label>
              <input v-model="searchQuery" type="text" placeholder="Search by title, description, or applicant..." class="w-full rounded-none border border-gray-200 px-4 py-2 text-sm font-mono focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500">
            </div>
          </div>
        </div>

        <!-- Queue Table -->
        <div class="bg-white border border-gray-100 shadow-sm overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full border-collapse">
              <thead>
                <tr class="bg-gray-50 border-b border-gray-100">
                  <th class="py-3 px-4 text-left text-[8px] font-black text-gray-400 uppercase tracking-widest">Title</th>
                  <th class="py-3 px-4 text-left text-[8px] font-black text-gray-400 uppercase tracking-widest">Applicant</th>
                  <th class="py-3 px-4 text-left text-[8px] font-black text-gray-400 uppercase tracking-widest">Category</th>
                  <th class="py-3 px-4 text-right text-[8px] font-black text-gray-400 uppercase tracking-widest">Amount</th>
                  <th class="py-3 px-4 text-center text-[8px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                  <th class="py-3 px-4 text-right text-[8px] font-black text-gray-400 uppercase tracking-widest">Updated</th>
                  <th class="py-3 px-4 text-right text-[8px] font-black text-gray-400 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-50">
                <tr v-for="app in paginatedApps" :key="app.id" class="hover:bg-gray-50/50 transition-colors">
                  <td class="py-3 px-4 text-[10px] font-bold text-gray-900 uppercase tracking-tight">{{ app.title }}</td>
                  <td class="py-3 px-4 text-[9px] text-gray-500 font-mono">{{ app.applicant_id }}</td>
                  <td class="py-3 px-4 text-[8px] font-bold text-gray-500 uppercase">{{ app.category }}</td>
                  <td class="py-3 px-4 text-right text-[10px] font-bold text-gray-900 font-mono">{{ formatAmount(app.amount) }}</td>
                  <td class="py-3 px-4 text-center">
                    <span :class="statusBadgeClass(app.status)" class="text-[8px] font-black px-2 py-0.5 border uppercase font-mono">
                      {{ app.status.replace(/_/g, ' ') }}
                    </span>
                  </td>
                  <td class="py-3 px-4 text-right text-[9px] text-gray-400 font-mono">{{ formatDate(app.updated_at) }}</td>
                  <td class="py-3 px-4 text-right">
                    <div class="flex items-center justify-end gap-1">
                      <!-- Quick actions based on status -->
                      <button
                        v-if="app.status === 'SUBMITTED'"
                        @click="quickAction(app.id, 'review')"
                        class="px-2 py-1 text-[8px] font-bold font-mono text-blue-600 border border-blue-200 hover:bg-blue-50 uppercase tracking-wider"
                      >
                        Take Review
                      </button>
                      <button @click="viewDetail(app.id)" class="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50" title="View">
                        <i class="fas fa-eye text-xs"></i>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="filteredApps.length === 0">
                  <td colspan="7" class="py-12 text-center text-[10px] text-gray-400 uppercase tracking-widest italic font-mono">QUEUE_IS_EMPTY</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div v-if="filteredApps.length > 0" class="px-4 py-3 border-t border-gray-100 flex justify-between items-center bg-gray-50/30">
            <div class="text-[9px] text-gray-400 uppercase tracking-widest font-mono">Showing {{ startIdx }}-{{ endIdx }} of {{ filteredApps.length }}</div>
            <div class="flex gap-2">
              <button @click="page--" :disabled="page === 1" class="px-3 py-1 border border-gray-200 text-[9px] font-bold font-mono uppercase disabled:opacity-30 hover:bg-white transition-colors">Prev</button>
              <span class="px-3 py-1 text-[9px] font-bold font-mono text-emerald-600">{{ page }} / {{ totalPages }}</span>
              <button @click="page++" :disabled="page >= totalPages" class="px-3 py-1 border border-gray-200 text-[9px] font-bold font-mono uppercase disabled:opacity-30 hover:bg-white transition-colors">Next</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Review Action Modal -->
      <div v-if="showReviewModal" class="fixed inset-0 z-[200] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" @click="showReviewModal = false"></div>
        <div class="bg-white w-full max-w-xl shadow-2xl relative z-10 border border-gray-100">
          <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h3 class="text-[11px] font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
              <span class="w-2 h-2 bg-emerald-600"></span>
              <span>REVIEW_APPLICATION</span>
            </h3>
            <button @click="showReviewModal = false" class="text-gray-400 hover:text-red-500 transition-colors">
              <i class="fas fa-times"></i>
            </button>
          </div>

          <div class="p-6 space-y-4">
            <div class="bg-gray-50 border border-gray-100 p-4 space-y-2">
              <div class="flex justify-between">
                <span class="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Title</span>
                <span class="text-[10px] font-bold text-gray-900 uppercase">{{ reviewTarget?.title }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Applicant</span>
                <span class="text-[10px] text-gray-700 font-mono">{{ reviewTarget?.applicant_id }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Amount</span>
                <span class="text-[10px] font-bold text-gray-900 font-mono">{{ formatAmount(reviewTarget?.amount) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Status</span>
                <span :class="statusBadgeClass(reviewTarget?.status)" class="text-[8px] font-black px-2 py-0.5 border uppercase font-mono">{{ reviewTarget?.status?.replace(/_/g, ' ') }}</span>
              </div>
            </div>

            <div>
              <label class="block text-[9px] font-bold text-gray-500 uppercase tracking-wider mb-1">Action</label>
              <div class="grid grid-cols-3 gap-2">
                <button
                  v-if="reviewTarget?.status === 'SUBMITTED'"
                  @click="reviewAction = 'review'"
                  :class="reviewAction === 'review' ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 text-gray-500 hover:border-blue-300'"
                  class="border px-2 py-2 text-[9px] font-bold font-mono uppercase tracking-wider transition-colors"
                >
                  <i class="fas fa-search mr-1"></i> Review
                </button>
                <button
                  v-if="reviewTarget?.status === 'UNDER_REVIEW'"
                  @click="reviewAction = 'approve'"
                  :class="reviewAction === 'approve' ? 'bg-emerald-600 text-white border-emerald-600' : 'border-gray-200 text-gray-500 hover:border-emerald-300'"
                  class="border px-2 py-2 text-[9px] font-bold font-mono uppercase tracking-wider transition-colors"
                >
                  <i class="fas fa-check mr-1"></i> Approve
                </button>
                <button
                  v-if="reviewTarget?.status === 'UNDER_REVIEW'"
                  @click="reviewAction = 'reject'"
                  :class="reviewAction === 'reject' ? 'bg-red-600 text-white border-red-600' : 'border-gray-200 text-gray-500 hover:border-red-300'"
                  class="border px-2 py-2 text-[9px] font-bold font-mono uppercase tracking-wider transition-colors"
                >
                  <i class="fas fa-times mr-1"></i> Reject
                </button>
                <button
                  v-if="reviewTarget?.status === 'SUBMITTED'"
                  @click="reviewAction = 'return'"
                  :class="reviewAction === 'return' ? 'bg-purple-600 text-white border-purple-600' : 'border-gray-200 text-gray-500 hover:border-purple-300'"
                  class="border px-2 py-2 text-[9px] font-bold font-mono uppercase tracking-wider transition-colors"
                >
                  <i class="fas fa-undo mr-1"></i> Return
                </button>
              </div>
            </div>

            <div v-if="reviewAction === 'reject' || reviewAction === 'return'">
              <label class="block text-[9px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                Comment <span class="text-red-500">*</span>
              </label>
              <textarea v-model="reviewComment" rows="3" class="w-full bg-gray-50 border border-gray-200 text-[11px] font-mono focus:border-emerald-600 focus:ring-0" placeholder="Required for reject / return..."></textarea>
            </div>

            <div v-if="reviewAction && reviewAction !== 'reject' && reviewAction !== 'return'">
              <label class="block text-[9px] font-bold text-gray-500 uppercase tracking-wider mb-1">Comment (optional)</label>
              <textarea v-model="reviewComment" rows="2" class="w-full bg-gray-50 border border-gray-200 text-[11px] font-mono focus:border-emerald-600 focus:ring-0" placeholder="Optional feedback..."></textarea>
            </div>

            <div v-if="actionError" class="bg-red-50 border border-red-200 px-4 py-2 text-[9px] font-bold text-red-700 uppercase">{{ actionError }}</div>
          </div>

          <div class="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
            <button @click="showReviewModal = false" class="px-4 py-2 text-[10px] font-bold font-mono text-gray-500 uppercase hover:bg-gray-200 transition-colors">Cancel</button>
            <button @click="executeReview" :disabled="!reviewAction || actionLoading" class="px-6 py-2 bg-emerald-600 text-white text-[10px] font-bold font-mono uppercase hover:bg-emerald-700 transition-colors disabled:opacity-50">
              {{ actionLoading ? 'PROCESSING...' : 'CONFIRM' }}
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
  { label: 'Queue', icon: 'fas fa-inbox', color: 'text-emerald-600', value: applications.value.filter(a => ['SUBMITTED', 'UNDER_REVIEW', 'RETURNED_FOR_CHANGES'].includes(a.status)).length },
  { label: 'Pending', icon: 'fas fa-clock', color: 'text-amber-600', value: applications.value.filter(a => a.status === 'SUBMITTED').length },
  { label: 'In Review', icon: 'fas fa-search', color: 'text-blue-600', value: applications.value.filter(a => a.status === 'UNDER_REVIEW').length },
  { label: 'Decided', icon: 'fas fa-gavel', color: 'text-purple-600', value: applications.value.filter(a => a.status === 'APPROVED' || a.status === 'REJECTED').length },
])

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
    const params = { limit: 500 }
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
