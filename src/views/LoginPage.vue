<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 font-mono relative">
    <div class="fixed inset-0 z-0 pointer-events-none mesh-background"></div>

    <div class="bg-white border border-gray-200 shadow-lg w-full max-w-md relative z-10">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
        <div class="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-2">
          <i class="fas fa-check-circle text-blue-600"></i>
          Submission & Approval
        </div>
        <h1 class="text-lg font-black text-gray-900 uppercase tracking-tight">Sign In</h1>
      </div>

      <!-- Form -->
      <div class="p-6 space-y-4">
        <div v-if="error" class="bg-red-50 border border-red-200 px-4 py-3 text-[10px] font-bold text-red-700 uppercase tracking-wider flex items-center gap-2">
          <i class="fas fa-exclamation-triangle"></i> {{ error }}
        </div>

        <div>
          <label class="block text-[9px] font-bold text-gray-500 uppercase tracking-wider mb-1">Email</label>
          <input
            v-model="email"
            type="email"
            class="w-full border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm font-mono focus:border-blue-600 focus:ring-0 placeholder:text-gray-300"
            placeholder="demo@applicant.com"
            @keyup.enter="handleLogin"
          />
        </div>

        <div>
          <label class="block text-[9px] font-bold text-gray-500 uppercase tracking-wider mb-1">Password</label>
          <input
            v-model="password"
            type="password"
            class="w-full border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm font-mono focus:border-blue-600 focus:ring-0 placeholder:text-gray-300"
            placeholder="password123"
            @keyup.enter="handleLogin"
          />
        </div>

        <button
          @click="handleLogin"
          :disabled="loading"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-[11px] font-bold font-mono uppercase tracking-widest transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <i v-if="loading" class="fas fa-spinner fa-spin"></i>
          {{ loading ? 'Authenticating...' : 'Sign In' }}
        </button>

        <!-- Demo credentials -->
        <div class="border-t border-gray-100 pt-4 mt-4">
          <p class="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-3 text-center">Demo Credentials</p>
          <div class="grid grid-cols-2 gap-3">
            <button
              @click="email='demo@applicant.com'; password='password123'"
              class="border border-blue-100 bg-blue-50 px-3 py-2 text-[9px] font-bold font-mono text-blue-600 uppercase tracking-wider hover:bg-blue-100 transition-colors"
            >
              <i class="fas fa-user mr-1"></i> Applicant
            </button>
            <button
              @click="email='demo@reviewer.com'; password='password123'"
              class="border border-emerald-100 bg-emerald-50 px-3 py-2 text-[9px] font-bold font-mono text-emerald-600 uppercase tracking-wider hover:bg-emerald-100 transition-colors"
            >
              <i class="fas fa-check-double mr-1"></i> Reviewer
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '@/api_services/api'

const router = useRouter()
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

async function handleLogin() {
  error.value = ''
  if (!email.value || !password.value) {
    error.value = 'Email and password are required'
    return
  }

  loading.value = true
  try {
    const res = await login(email.value, password.value)
    const { access_token, user } = res.data
    localStorage.setItem('token', access_token)
    localStorage.setItem('user', JSON.stringify(user))
    router.push(user.role === 'reviewer' ? '/reviewer' : '/applicant')
  } catch (e) {
    error.value = e.response?.data?.detail || 'Login failed'
  } finally {
    loading.value = false
  }
}
</script>
