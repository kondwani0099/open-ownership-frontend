<template>
  <div class="min-h-screen flex flex-col font-mono relative text-gray-900 bg-gray-50">
    <div class="fixed inset-0 z-0 pointer-events-none mesh-background"></div>

    <!-- Header -->
    <header class="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-[100] shadow-sm">
      <div class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-1.5 h-8 bg-blue-600"></div>
          <div>
            <div class="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <i class="fas fa-file-alt text-blue-600"></i>
              <span>Applicant // My Applications</span>
            </div>
            <h1 class="text-xl font-black text-gray-900 uppercase tracking-tight font-display">{{ user?.name || 'Dashboard' }}</h1>
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
        <div class="h-12 w-12 border-4 border-gray-100 border-t-blue-600 rounded-full animate-spin shadow-lg mb-4"></div>
        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest animate-pulse">Loading Applications...</p>
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

        <!-- Actions Bar -->
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <select v-model="statusFilter" class="rounded-none border border-gray-200 shadow-sm text-[10px] font-bold font-mono uppercase tracking-wider py-1.5 px-3">
              <option value="">All Statuses</option>
              <option value="DRAFT">Draft</option>
              <option value="SUBMITTED">Submitted</option>
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
              <option value="RETURNED_FOR_CHANGES">Returned</option>
            </select>
          </div>
          <button @click="openCreateModal" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-[10px] font-bold font-mono uppercase shadow-md transition-all flex items-center gap-2">
            <i class="fas fa-plus"></i> New Application
          </button>
        </div>

        <!-- Applications Table -->
        <div class="bg-white border border-gray-100 shadow-sm overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full border-collapse">
              <thead>
                <tr class="bg-gray-50 border-b border-gray-100">
                  <th class="py-3 px-4 text-left text-[8px] font-black text-gray-400 uppercase tracking-widest">Title</th>
                  <th class="py-3 px-4 text-left text-[8px] font-black text-gray-400 uppercase tracking-widest">Category</th>
                  <th class="py-3 px-4 text-right text-[8px] font-black text-gray-400 uppercase tracking-widest">Amount</th>
                  <th class="py-3 px-4 text-center text-[8px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                  <th class="py-3 px-4 text-right text-[8px] font-black text-gray-400 uppercase tracking-widest">Updated</th>
                  <th class="py-3 px-4 text-right text-[8px] font-black text-gray-400 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-50">
                <tr v-for="app in applications" :key="app.id" class="hover:bg-gray-50/50 transition-colors">
                  <td class="py-3 px-4 text-[10px] font-bold text-gray-900 uppercase tracking-tight">{{ app.title }}</td>
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
                      <button v-if="app.status === 'DRAFT'" @click="openEditModal(app)" class="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50" title="Edit">
                        <i class="fas fa-edit text-xs"></i>
                      </button>
                      <button v-if="app.status === 'DRAFT'" @click="submitApplication(app.id)" class="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50" title="Submit">
                        <i class="fas fa-paper-plane text-xs"></i>
                      </button>
                      <button @click="viewDetail(app.id)" class="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50" title="View">
                        <i class="fas fa-eye text-xs"></i>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="applications.length === 0">
                  <td colspan="6" class="py-12 text-center text-[10px] text-gray-400 uppercase tracking-widest italic font-mono">
                    {{ statusFilter ? 'NO_APPLICATIONS_MATCH_FILTER' : 'NO_APPLICATIONS_YET' }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Create / Edit Modal -->
      <div v-if="showModal" class="fixed inset-0 z-[200] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" @click="closeModal"></div>
        <div class="bg-white w-full max-w-xl shadow-2xl relative z-10 border border-gray-100">
          <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h3 class="text-[11px] font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
              <span class="w-2 h-2" :class="editing ? 'bg-amber-500' : 'bg-blue-600'"></span>
              <span>{{ editing ? 'EDIT_APPLICATION' : 'NEW_APPLICATION' }}</span>
            </h3>
            <button @click="closeModal" class="text-gray-400 hover:text-red-500 transition-colors">
              <i class="fas fa-times"></i>
            </button>
          </div>

          <div class="p-6 space-y-4">
            <div>
              <label class="block text-[9px] font-bold text-gray-500 uppercase tracking-wider mb-1">Title <span class="text-red-500">*</span></label>
              <input v-model="form.title" type="text" class="w-full bg-gray-50 border border-gray-200 text-[11px] font-mono focus:border-blue-600 focus:ring-0 placeholder:text-gray-300" placeholder="Application title" />
            </div>

            <div>
              <label class="block text-[9px] font-bold text-gray-500 uppercase tracking-wider mb-1">Category <span class="text-red-500">*</span></label>
              <select v-model="form.category" class="w-full bg-gray-50 border border-gray-200 text-[10px] font-mono focus:border-blue-600 focus:ring-0 uppercase py-2">
                <option value="" disabled>SELECT CATEGORY</option>
                <option value="Funding">Funding</option>
                <option value="Equipment">Equipment</option>
                <option value="Travel">Travel</option>
                <option value="Training">Training</option>
                <option value="Software">Software</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label class="block text-[9px] font-bold text-gray-500 uppercase tracking-wider mb-1">Amount</label>
              <div class="relative">
                <span class="absolute left-3 top-2.5 text-xs text-gray-400 font-mono">K</span>
                <input v-model.number="form.amount" type="number" min="0" class="w-full bg-gray-50 border border-gray-200 pl-8 text-[11px] font-mono focus:border-blue-600 focus:ring-0" placeholder="0.00" />
              </div>
            </div>

            <div>
              <label class="block text-[9px] font-bold text-gray-500 uppercase tracking-wider mb-1">Description</label>
              <textarea v-model="form.description" rows="3" class="w-full bg-gray-50 border border-gray-200 text-[11px] font-mono focus:border-blue-600 focus:ring-0" placeholder="Optional description..."></textarea>
            </div>

            <div v-if="error" class="bg-red-50 border border-red-200 px-4 py-2 text-[9px] font-bold text-red-700 uppercase">{{ error }}</div>
          </div>

          <div class="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
            <button @click="closeModal" class="px-4 py-2 text-[10px] font-bold font-mono text-gray-500 uppercase hover:bg-gray-200 transition-colors">Cancel</button>
            <button @click="saveApplication" :disabled="saving" class="px-6 py-2 bg-blue-600 text-white text-[10px] font-bold font-mono uppercase hover:bg-blue-700 transition-colors disabled:opacity-50">
              {{ saving ? 'SAVING...' : (editing ? 'UPDATE' : 'CREATE') }}
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
import { listMyApplications, createApplication, updateApplication, transitionApplication } from '@/api_services/api'

const router = useRouter()
const user = ref(JSON.parse(localStorage.getItem('user') || '{}'))
const loading = ref(false)
const applications = ref([])
const statusFilter = ref('')

// Modal state
const showModal = ref(false)
const editing = ref(false)
const editId = ref(null)
const saving = ref(false)
const error = ref('')

const form = ref({
  title: '',
  category: '',
  description: '',
  amount: 0,
})

// KPI cards
const kpiCards = computed(() => [
  { label: 'Total', icon: 'fas fa-chart-line', color: 'text-blue-600', value: applications.value.length },
  { label: 'Drafts', icon: 'fas fa-pencil-alt', color: 'text-gray-400', value: applications.value.filter(a => a.status === 'DRAFT').length },
  { label: 'Submitted', icon: 'fas fa-paper-plane', color: 'text-amber-600', value: applications.value.filter(a => a.status === 'SUBMITTED' || a.status === 'UNDER_REVIEW').length },
  { label: 'Decided', icon: 'fas fa-check-circle', color: 'text-emerald-600', value: applications.value.filter(a => a.status === 'APPROVED' || a.status === 'REJECTED').length },
])

// Status badge
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

watch(statusFilter, () => fetchApplications())

// CRUD
function openCreateModal() {
  editing.value = false
  editId.value = null
  error.value = ''
  form.value = { title: '', category: '', description: '', amount: 0 }
  showModal.value = true
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
  showModal.value = true
}

function closeModal() {
  showModal.value = false
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
  if (!confirm('Submit this application for review? You will not be able to edit it afterwards.')) return
  try {
    await transitionApplication(id, 'submit')
    await fetchApplications()
  } catch (e) {
    alert(e.response?.data?.detail || 'Submit failed')
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

onMounted(() => fetchApplications())
</script>
