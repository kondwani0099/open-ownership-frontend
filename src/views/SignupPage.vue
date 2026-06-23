<template>
  <div class="min-h-screen flex">
    <!-- Left: Form -->
    <div class="w-full lg:w-1/2 flex items-center justify-center bg-white px-4 py-12 lg:px-12">
      <div class="w-full max-w-md">
        <AppLogo />
        <div class="mt-8 mb-6">
          <h1 class="text-2xl font-extrabold text-gray-900">Create your account</h1>
          <p class="text-sm text-gray-500 mt-1">Start your submission journey today</p>
        </div>

        <div v-if="error" class="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-xs font-semibold text-red-700 flex items-center gap-2 mb-4">
          <i class="fas fa-exclamation-triangle"></i> {{ error }}
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-gray-600 mb-1.5">Full Name</label>
            <input v-model="name" type="text" class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 placeholder:text-gray-300" placeholder="Alice Applicant" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-600 mb-1.5">Email</label>
            <input v-model="email" type="email" class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 placeholder:text-gray-300" placeholder="alice@example.com" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-600 mb-1.5">Password</label>
            <input v-model="password" type="password" class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 placeholder:text-gray-300" placeholder="Minimum 6 characters" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-600 mb-1.5">Role</label>
            <div class="grid grid-cols-2 gap-3">
              <button type="button" @click="role = 'applicant'" :class="role === 'applicant' ? 'bg-brand-600 text-white border-brand-600' : 'border-gray-200 text-gray-500 hover:border-brand-300'" class="border px-3 py-3 text-xs font-semibold rounded-xl transition-colors">
                <i class="fas fa-user mr-1"></i> Applicant
              </button>
              <button type="button" @click="role = 'reviewer'" :class="role === 'reviewer' ? 'bg-emerald-600 text-white border-emerald-600' : 'border-gray-200 text-gray-500 hover:border-emerald-300'" class="border px-3 py-3 text-xs font-semibold rounded-xl transition-colors">
                <i class="fas fa-check-double mr-1"></i> Reviewer
              </button>
            </div>
          </div>
          <button @click="handleSignup" :disabled="loading" class="w-full bg-brand-600 hover:bg-brand-700 text-white py-3 text-sm font-semibold rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-brand-600/20">
            <i v-if="loading" class="fas fa-spinner fa-spin"></i>
            {{ loading ? 'Creating Account...' : 'Create Account' }}
          </button>
        </div>

        <p class="text-center text-sm text-gray-500 mt-6">
          Already have an account?
          <router-link to="/login" class="text-brand-600 font-semibold hover:underline">Sign In</router-link>
        </p>
      </div>
    </div>

    <!-- Right: Image Panel -->
    <div class="hidden lg:block lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-brand-600 via-brand-700 to-indigo-900">
      <img src="/office.png" alt="Office" class="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay" />
      <div class="absolute inset-0 bg-gradient-to-t from-brand-900/80 via-brand-900/30 to-transparent"></div>
      <div class="relative z-10 flex flex-col justify-end h-full p-16">
        <div class="mb-8">
          <div class="w-16 h-1 bg-emerald-400 rounded-full mb-6"></div>
          <h2 class="text-3xl font-extrabold text-white leading-tight">
            Join teams that trust<br />Open Ownership
          </h2>
          <p class="text-white/60 text-sm mt-4 max-w-md leading-relaxed">
            Create your account in seconds. Submit applications, track their progress, and get notified at every step.
          </p>
        </div>
        <div class="flex gap-8">
          <div>
            <div class="text-2xl font-extrabold text-white">Free</div>
            <div class="text-xs text-white/50 mt-0.5">No credit card</div>
          </div>
          <div>
            <div class="text-2xl font-extrabold text-white">2 min</div>
            <div class="text-xs text-white/50 mt-0.5">Setup time</div>
          </div>
          <div>
            <div class="text-2xl font-extrabold text-white">24/7</div>
            <div class="text-xs text-white/50 mt-0.5">Access</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { register } from '@/api_services/api'
import AppLogo from '@/components/AppLogo.vue'

const router = useRouter()
const name = ref('')
const email = ref('')
const password = ref('')
const role = ref('applicant')
const loading = ref(false)
const error = ref('')

async function handleSignup() {
  error.value = ''
  if (!name.value.trim()) { error.value = 'Full name is required'; return }
  if (!email.value.trim()) { error.value = 'Email is required'; return }
  if (!password.value || password.value.length < 6) { error.value = 'Password must be at least 6 characters'; return }

  loading.value = true
  try {
    const res = await register(name.value.trim(), email.value.trim(), password.value, role.value)
    const { access_token, user } = res.data
    localStorage.setItem('token', access_token)
    localStorage.setItem('user', JSON.stringify(user))
    router.push(user.role === 'reviewer' ? '/reviewer' : '/applicant')
  } catch (e) {
    error.value = e.response?.data?.detail || 'Registration failed'
  } finally {
    loading.value = false
  }
}
</script>
