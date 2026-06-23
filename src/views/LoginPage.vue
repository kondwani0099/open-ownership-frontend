<template>
  <div class="min-h-screen flex">
    <!-- Left: Form -->
    <div class="w-full lg:w-1/2 flex items-center justify-center bg-white px-4 py-12 lg:px-12">
      <div class="w-full max-w-md">
        <AppLogo />
        <div class="mt-8 mb-6">
          <h1 class="text-2xl font-extrabold text-gray-900">Welcome back</h1>
          <p class="text-sm text-gray-500 mt-1">Sign in to your account to continue</p>
        </div>

        <div v-if="error" class="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-xs font-semibold text-red-700 flex items-center gap-2 mb-4">
          <i class="fas fa-exclamation-triangle"></i> {{ error }}
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-gray-600 mb-1.5">Email</label>
            <input v-model="email" type="email" class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 placeholder:text-gray-300" placeholder="demo@applicant.com" @keyup.enter="handleLogin" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-600 mb-1.5">Password</label>
            <input v-model="password" type="password" class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 placeholder:text-gray-300" placeholder="password123" @keyup.enter="handleLogin" />
          </div>
          <button @click="handleLogin" :disabled="loading" class="w-full bg-brand-600 hover:bg-brand-700 text-white py-3 text-sm font-semibold rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-brand-600/20">
            <i v-if="loading" class="fas fa-spinner fa-spin"></i>
            {{ loading ? 'Signing in...' : 'Sign In' }}
          </button>
        </div>

        <div class="mt-6 pt-6 border-t border-gray-100">
          <p class="text-center text-sm text-gray-500">
            Don't have an account?
            <router-link to="/signup" class="text-brand-600 font-semibold hover:underline">Sign Up</router-link>
          </p>
          <p class="text-[10px] font-semibold text-gray-400 tracking-wider mt-4 mb-3 text-center uppercase">Demo Credentials</p>
          <div class="grid grid-cols-2 gap-3">
            <button @click="email='demo@applicant.com'; password='password123'" class="border border-brand-200 bg-brand-50 px-3 py-2.5 text-xs font-semibold text-brand-600 rounded-xl hover:bg-brand-100 transition-colors">
              <i class="fas fa-user mr-1"></i> Applicant
            </button>
            <button @click="email='demo@reviewer.com'; password='password123'" class="border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-xs font-semibold text-emerald-600 rounded-xl hover:bg-emerald-100 transition-colors">
              <i class="fas fa-check-double mr-1"></i> Reviewer
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Right: Image Panel -->
    <div class="hidden lg:block lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-brand-600 via-brand-700 to-indigo-900">
      <img src="/office.png" alt="Office" class="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay" />
      <!-- Gradient overlay -->
      <div class="absolute inset-0 bg-gradient-to-t from-brand-900/80 via-brand-900/30 to-transparent"></div>
      <!-- Content -->
      <div class="relative z-10 flex flex-col justify-end h-full p-16">
        <div class="mb-8">
          <div class="w-16 h-1 bg-emerald-400 rounded-full mb-6"></div>
          <h2 class="text-3xl font-extrabold text-white leading-tight">
            Streamline approvals with<br />transparent workflows
          </h2>
          <p class="text-white/60 text-sm mt-4 max-w-md leading-relaxed">
            Submit applications, track approvals in real-time, and get notified instantly. Built for teams that value accountability.
          </p>
        </div>
        <!-- Stats -->
        <div class="flex gap-8">
          <div>
            <div class="text-2xl font-extrabold text-white">98%</div>
            <div class="text-xs text-white/50 mt-0.5">Approval rate</div>
          </div>
          <div>
            <div class="text-2xl font-extrabold text-white">&lt;24h</div>
            <div class="text-xs text-white/50 mt-0.5">Avg. turnaround</div>
          </div>
          <div>
            <div class="text-2xl font-extrabold text-white">500+</div>
            <div class="text-xs text-white/50 mt-0.5">Applications</div>
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
import AppLogo from '@/components/AppLogo.vue'

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
