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
              <i class="fas fa-file-alt text-brand-600"></i>
              <span>My Applications</span>
            </div>
            <h1 class="text-lg font-bold text-gray-900">{{ user?.name || 'Dashboard' }}</h1>
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
    <main class="flex-1 max-w-7xl mx-auto w-full px-3 sm:px-6 lg:px-8 pt-4 sm:pt-8 pb-12 space-y-4 sm:space-y-6">
      <div v-if="loading" class="flex flex-col items-center justify-center py-20">
        <div class="h-12 w-12 border-4 border-gray-100 border-t-brand-600 rounded-full animate-spin mb-4"></div>
        <p class="text-xs font-medium text-gray-400 animate-pulse">Loading Applications...</p>
      </div>

      <div v-else class="space-y-6">
        <!-- KPI Cards -->
        <div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div v-for="card in kpiCards" :key="card.label" class="bg-white border border-gray-100 rounded-2xl p-3 sm:p-5 hover:shadow-lg transition-shadow">
            <div class="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
              <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center" :class="card.bg">
                <i :class="[card.icon, card.color]" class="text-xs sm:text-sm"></i>
              </div>
              <span class="text-[9px] sm:text-[10px] font-semibold text-gray-400 tracking-wider">{{ card.label }}</span>
            </div>
            <p class="text-xl sm:text-2xl font-extrabold text-gray-900">{{ card.value }}</p>
          </div>
        </div>

        <!-- Actions Bar -->
        <div class="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:justify-between">
          <select v-model="statusFilter" class="w-full sm:w-auto rounded-xl border border-gray-200 text-xs font-medium py-2 px-4 focus:border-brand-500 focus:ring-1 focus:ring-brand-500">
            <option value="">All Statuses</option>
            <option value="DRAFT">Draft</option>
            <option value="SUBMITTED">Submitted</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
            <option value="RETURNED_FOR_CHANGES">Returned</option>
          </select>
          <button @click="openCreateModal" class="w-full sm:w-auto bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 text-xs font-semibold rounded-xl transition-all shadow-lg shadow-brand-600/20 flex items-center justify-center gap-2">
            <i class="fas fa-plus"></i> New Application
          </button>
        </div>

        <!-- Applications Table -->
        <div class="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="bg-gray-50/50 border-b border-gray-100">
                  <th class="py-2.5 sm:py-3.5 px-3 sm:px-5 text-left text-[9px] sm:text-[10px] font-semibold text-gray-400 tracking-wider">Title</th>
                  <th class="py-2.5 sm:py-3.5 px-3 sm:px-5 text-left text-[9px] sm:text-[10px] font-semibold text-gray-400 tracking-wider hidden sm:table-cell">Category</th>
                  <th class="py-2.5 sm:py-3.5 px-3 sm:px-5 text-right text-[9px] sm:text-[10px] font-semibold text-gray-400 tracking-wider">Amount</th>
                  <th class="py-2.5 sm:py-3.5 px-3 sm:px-5 text-center text-[9px] sm:text-[10px] font-semibold text-gray-400 tracking-wider">Status</th>
                  <th class="py-2.5 sm:py-3.5 px-3 sm:px-5 text-right text-[9px] sm:text-[10px] font-semibold text-gray-400 tracking-wider hidden sm:table-cell">Updated</th>
                  <th class="py-2.5 sm:py-3.5 px-3 sm:px-5 text-right text-[9px] sm:text-[10px] font-semibold text-gray-400 tracking-wider"></th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-50">
                <tr v-for="app in paginatedApplications" :key="app.id" class="hover:bg-gray-50/50 transition-colors">
                  <td class="py-2.5 sm:py-3.5 px-3 sm:px-5 text-xs sm:text-sm font-semibold text-gray-900">{{ app.title }}</td>
                  <td class="py-2.5 sm:py-3.5 px-3 sm:px-5 text-[10px] sm:text-xs font-medium text-gray-500 hidden sm:table-cell">{{ app.category }}</td>
                  <td class="py-2.5 sm:py-3.5 px-3 sm:px-5 text-right text-xs sm:text-sm font-bold text-gray-900">{{ formatAmount(app.amount) }}</td>
                  <td class="py-2.5 sm:py-3.5 px-3 sm:px-5 text-center">
                    <span :class="statusBadgeClass(app.status)" class="text-[8px] sm:text-[10px] font-semibold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full whitespace-nowrap">
                      {{ app.status.replace(/_/g, ' ') }}
                    </span>
                  </td>
                  <td class="py-2.5 sm:py-3.5 px-3 sm:px-5 text-right text-[10px] sm:text-xs text-gray-400 hidden sm:table-cell">{{ formatDate(app.updated_at) }}</td>
                  <td class="py-2.5 sm:py-3.5 px-3 sm:px-5 text-right">
                    <div class="flex items-center justify-end gap-1.5">
                      <button v-if="app.status === 'DRAFT'" @click="openEditModal(app)" class="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" title="Edit">
                        <i class="fas fa-edit text-xs"></i>
                      </button>
                      <button v-if="app.status === 'DRAFT'" @click="submitApplication(app.id)" class="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Submit">
                        <i class="fas fa-paper-plane text-xs"></i>
                      </button>
                      <button @click="viewDetail(app.id)" class="p-2 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors" title="View">
                        <i class="fas fa-eye text-xs"></i>
                      </button>
                      <button v-if="app.status === 'DRAFT'" @click="deleteEntry(app)" class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                        <i class="fas fa-trash text-xs"></i>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="applications.length === 0">
                  <td colspan="6" class="py-16 text-center text-sm text-gray-400 font-medium">
                    {{ statusFilter ? 'No applications match this filter' : 'No applications yet — create your first one!' }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <!-- Pagination -->
          <div v-if="applications.length > 0" class="px-3 sm:px-5 py-3 border-t border-gray-100 flex justify-between items-center bg-gray-50/30">
            <div class="text-[10px] sm:text-xs text-gray-400 font-medium">Showing {{ startIdx }}-{{ endIdx }} of {{ applications.length }}</div>
            <div class="flex gap-2">
              <button @click="currentPage--" :disabled="currentPage === 1" class="px-3 py-1.5 border border-gray-200 text-[10px] sm:text-xs font-semibold rounded-lg disabled:opacity-30 hover:bg-white transition-colors">Prev</button>
              <span class="px-3 py-1.5 text-[10px] sm:text-xs font-bold text-brand-600">{{ currentPage }} / {{ totalPages }}</span>
              <button @click="currentPage++" :disabled="currentPage >= totalPages" class="px-3 py-1.5 border border-gray-200 text-[10px] sm:text-xs font-semibold rounded-lg disabled:opacity-30 hover:bg-white transition-colors">Next</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Create / Edit Modal -->
      <div v-if="showFormModal" class="fixed inset-0 z-[200] flex items-end sm:items-center justify-center sm:p-4">
        <div class="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" @click="closeModal"></div>
        <div class="bg-white w-full sm:max-w-xl rounded-t-2xl sm:rounded-2xl shadow-2xl relative z-10 overflow-hidden max-h-[90vh] overflow-y-auto">
          <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h3 class="text-sm font-bold text-gray-900 flex items-center gap-2">
              <span class="w-2 h-2 rounded-full" :class="editing ? 'bg-amber-500' : 'bg-brand-600'"></span>
              {{ editing ? 'Edit Application' : 'New Application' }}
            </h3>
            <button @click="closeModal" class="text-gray-400 hover:text-red-500 transition-colors p-1">
              <i class="fas fa-times"></i>
            </button>
          </div>

          <div class="p-6 space-y-4">
            <div>
              <label class="block text-xs font-semibold text-gray-600 mb-1.5">Title <span class="text-red-500">*</span></label>
              <input v-model="form.title" type="text" class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 placeholder:text-gray-300" placeholder="Application title" />
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-600 mb-1.5">Category <span class="text-red-500">*</span></label>
              <select v-model="form.category" class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500">
                <option value="" disabled>Select category</option>
                <option value="Funding">Funding</option>
                <option value="Equipment">Equipment</option>
                <option value="Travel">Travel</option>
                <option value="Training">Training</option>
                <option value="Software">Software</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-600 mb-1.5">Amount</label>
              <div class="relative">
                <span class="absolute left-4 top-2.5 text-sm text-gray-400 font-medium">K</span>
                <input v-model.number="form.amount" type="number" min="0" class="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500" placeholder="0.00" />
              </div>
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-600 mb-1.5">Description</label>
              <textarea v-model="form.description" rows="3" class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500" placeholder="Optional description..."></textarea>
            </div>
            <div v-if="error" class="bg-red-50 border border-red-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-red-700">{{ error }}</div>
          </div>

          <div class="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
            <button @click="closeModal" class="px-5 py-2.5 text-xs font-semibold text-gray-600 hover:bg-gray-200 rounded-xl transition-colors">Cancel</button>
            <button @click="saveApplication" :disabled="saving" class="px-6 py-2.5 bg-brand-600 text-white text-xs font-semibold rounded-xl hover:bg-brand-700 transition-colors disabled:opacity-50 shadow-lg shadow-brand-600/20">
              {{ saving ? 'Saving...' : (editing ? 'Update' : 'Create') }}
            </button>
          </div>
        </div>
      </div>
    </main>

    <!-- Action Modal (replaces alert/confirm) -->
    <ActionModal
      :visible="modal.visible"
      :type="modal.type"
      :title="modal.title"
      :message="modal.message"
      :confirmText="modal.confirmText"
      :confirmDanger="modal.confirmDanger"
      @confirm="modal.onConfirm"
      @close="modal.visible = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { listMyApplications, createApplication, updateApplication, transitionApplication } from '@/api_services/api'
import { api } from '@/api_services/api'
import AppLogo from '@/components/AppLogo.vue'
import NotificationBell from '@/components/NotificationBell.vue'
import ActionModal from '@/components/ActionModal.vue'

const router = useRouter()
const user = ref(JSON.parse(localStorage.getItem('user') || '{}'))
const loading = ref(false)
const applications = ref([])
const statusFilter = ref('')

// Pagination
const currentPage = ref(1)
const itemsPerPage = 10

const totalPages = computed(() => Math.ceil(applications.value.length / itemsPerPage) || 1)
const paginatedApplications = computed(() => applications.value.slice((currentPage.value - 1) * itemsPerPage, currentPage.value * itemsPerPage))
const startIdx = computed(() => applications.value.length === 0 ? 0 : (currentPage.value - 1) * itemsPerPage + 1)
const endIdx = computed(() => Math.min(currentPage.value * itemsPerPage, applications.value.length))

// Watch status filter — reset page
watch(statusFilter, () => { currentPage.value = 1; fetchApplications() })

// Modal state
const showFormModal = ref(false)
const editing = ref(false)
const editId = ref(null)
const saving = ref(false)
const error = ref('')

// Action modal (replaces alert/confirm)
const modal = reactive({
  visible: false, type: 'confirm', title: '', message: '', confirmText: 'Confirm', confirmDanger: false,
  onConfirm: () => {},
})

function showModal(type, title, message, confirmText, danger, callback) {
  Object.assign(modal, { visible: true, type, title, message, confirmText: confirmText || 'Confirm', confirmDanger: danger || false, onConfirm: () => { modal.visible = false; if (callback) callback() } })
}

const form = ref({
  title: '',
  category: '',
  description: '',
  amount: 0,
})

// KPI cards
const kpiCards = computed(() => [
  { label: 'Total', icon: 'fas fa-chart-line', color: 'text-brand-600', bg: 'bg-brand-50', value: applications.value.length },
  { label: 'Drafts', icon: 'fas fa-pencil-alt', color: 'text-gray-500', bg: 'bg-gray-100', value: applications.value.filter(a => a.status === 'DRAFT').length },
  { label: 'Submitted', icon: 'fas fa-paper-plane', color: 'text-amber-600', bg: 'bg-amber-50', value: applications.value.filter(a => a.status === 'SUBMITTED' || a.status === 'UNDER_REVIEW').length },
  { label: 'Decided', icon: 'fas fa-check-circle', color: 'text-emerald-600', bg: 'bg-emerald-50', value: applications.value.filter(a => a.status === 'APPROVED' || a.status === 'REJECTED').length },
])

// Status badge
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

// Fetch
async function fetchApplications() {
  loading.value = true
  try {
    const params = {}
    if (statusFilter.value) params.status = statusFilter.value
    const res = await listMyApplications(params)
    applications.value = res.data.applications || []
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

// CRUD
function openCreateModal() {
  editing.value = false
  editId.value = null
  error.value = ''
  form.value = { title: '', category: '', description: '', amount: 0 }
  showFormModal.value = true
}

function openEditModal(app) {
  editing.value = true
  editId.value = app.id
  error.value = ''
  form.value = {
    title: app.title,
    category: app.category,
    description: app.description,
    amount: app.amount,
  }
  showFormModal.value = true
}

function closeModal() {
  showFormModal.value = false
  editing.value = false
  editId.value = null
  error.value = ''
}

async function saveApplication() {
  error.value = ''
  if (!form.value.title.trim() || !form.value.category) {
    error.value = 'Title and category are required'
    return
  }
  saving.value = true
  try {
    if (editing.value) {
      await updateApplication(editId.value, form.value)
    } else {
      await createApplication(form.value)
    }
    closeModal()
    await fetchApplications()
  } catch (e) {
    error.value = e.response?.data?.detail || 'Save failed'
  } finally {
    saving.value = false
  }
}

async function submitApplication(id) {
  showModal('confirm', 'Submit for Review?', 'You will not be able to edit it afterwards.', 'Submit', false, async () => {
    try {
      await transitionApplication(id, 'submit')
      await fetchApplications()
      showModal('success', 'Submitted!', 'Your application has been submitted for review.')
    } catch (e) {
      showModal('error', 'Submit Failed', e.response?.data?.detail || 'Something went wrong.')
    }
  })
}

function viewDetail(id) {
  router.push(`/applications/${id}`)
}

function logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  router.push('/login')
}

async function deleteEntry(app) {
  showModal('confirm', 'Delete Application?', `"${app.title}" will be permanently deleted.`, 'Delete', true, async () => {
    try {
      await api.delete(`/applications/${app.id}`)
      await fetchApplications()
      showModal('success', 'Deleted!', 'The application has been deleted.')
    } catch (e) {
      showModal('error', 'Delete Failed', e.response?.data?.detail || 'Something went wrong.')
    }
  })
}

onMounted(() => fetchApplications())
</script>
