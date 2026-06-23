<template>
  <div class="min-h-screen flex flex-col font-sans bg-white text-gray-900">
    <!-- ── Navigation ── -->
    <header class="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100/50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div class="flex items-center gap-8">
          <AppLogo />
          <nav class="hidden lg:flex items-center gap-8">
            <a href="#" class="text-[13px] font-semibold text-gray-900 hover:text-brand-600 transition-colors">Home</a>
            <a href="#how" class="text-[13px] font-medium text-gray-500 hover:text-brand-600 transition-colors">How It Works</a>
            <a href="#features" class="text-[13px] font-medium text-gray-500 hover:text-brand-600 transition-colors">Features</a>
            <a href="#" class="text-[13px] font-medium text-gray-500 hover:text-brand-600 transition-colors">Pricing</a>
          </nav>
        </div>
        <div class="flex items-center gap-3">
          <button @click="$router.push('/login')" class="text-[13px] font-semibold text-gray-600 hover:text-brand-600 transition-colors px-4 py-2">
            Sign In
          </button>
          <button @click="$router.push('/signup')" class="bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 text-[13px] font-semibold rounded-lg transition-all shadow-lg shadow-brand-600/20 hover:shadow-brand-600/40">
            Get Started
          </button>
        </div>
      </div>
    </header>

    <!-- ── Hero ── -->
    <section class="pt-28 pb-20 lg:pt-36 lg:pb-28 relative overflow-hidden bg-gradient-to-br from-brand-600 via-brand-700 to-indigo-900">
      <!-- Background pattern -->
      <div class="absolute inset-0 opacity-[0.06]">
        <div class="absolute top-0 right-0 w-[600px] h-[600px] bg-white rounded-full -translate-y-1/2 translate-x-1/4"></div>
        <div class="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-white rounded-full translate-y-1/3"></div>
      </div>
      <!-- Grid dots -->
      <div class="absolute inset-0 opacity-10" style="background-image:radial-gradient(circle,rgba(255,255,255,0.3) 1px,transparent 1px);background-size:30px 30px;"></div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="max-w-2xl">
          <div class="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6">
            <span class="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
            <span class="text-xs font-medium text-white/80">Now accepting applications</span>
          </div>

          <h1 class="text-4xl lg:text-5xl xl:text-6xl font-extrabold text-white leading-[1.08] tracking-tight mb-6">
            Automate approvals with transparent workflows that scale
          </h1>
          <p class="text-lg text-white/70 leading-relaxed mb-8 max-w-xl">
            Submit applications, track approvals in real-time, and get notified instantly. Built for teams that need accountability at every step.
          </p>

          <div class="flex flex-wrap gap-3 mb-12">
            <button @click="$router.push('/signup')" class="bg-white hover:bg-gray-50 text-brand-700 px-7 py-3.5 text-sm font-semibold rounded-lg transition-all shadow-xl flex items-center gap-2">
              Apply Today <i class="fas fa-arrow-right text-xs"></i>
            </button>
            <button @click="$router.push('/login')" class="border border-white/25 hover:border-white/50 text-white px-7 py-3.5 text-sm font-semibold rounded-lg transition-all">
              Reviewer Portal
            </button>
          </div>

          <!-- Floating badges -->
          <div class="flex flex-wrap gap-3">
            <span class="bg-white/10 backdrop-blur-sm border border-white/15 text-white/90 text-xs font-medium px-4 py-2 rounded-full flex items-center gap-2">
              <i class="fas fa-clock text-emerald-300"></i> Real-Time Tracking
            </span>
            <span class="bg-white/10 backdrop-blur-sm border border-white/15 text-white/90 text-xs font-medium px-4 py-2 rounded-full flex items-center gap-2">
              <i class="fas fa-shield-halved text-blue-300"></i> Full Audit Trail
            </span>
            <span class="bg-white/10 backdrop-blur-sm border border-white/15 text-white/90 text-xs font-medium px-4 py-2 rounded-full flex items-center gap-2">
              <i class="fas fa-bell text-amber-300"></i> Instant Notifications
            </span>
            <span class="bg-white/10 backdrop-blur-sm border border-white/15 text-white/90 text-xs font-medium px-4 py-2 rounded-full flex items-center gap-2">
              <i class="fas fa-layer-group text-purple-300"></i> Multi-Role Access
            </span>
          </div>
        </div>
      </div>

      <!-- Floating metric cards (right side, desktop only) -->
      <div class="hidden lg:block absolute right-8 top-1/2 -translate-y-1/2 space-y-4 w-64 z-10">
        <div class="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4">
          <div class="flex items-center justify-between mb-2">
            <span class="text-[10px] font-semibold text-white/50 uppercase tracking-wider">Approval Rate</span>
            <span class="text-emerald-300 text-xs font-bold">▲ 98%</span>
          </div>
          <div class="text-2xl font-extrabold text-white">24h</div>
          <div class="text-[10px] text-white/40 mt-1">Average turnaround</div>
          <div class="mt-3 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div class="h-full bg-emerald-400 rounded-full" style="width:98%"></div>
          </div>
        </div>
        <div class="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-brand-500/30 rounded-xl flex items-center justify-center">
              <i class="fas fa-check-circle text-white"></i>
            </div>
            <div>
              <div class="text-lg font-extrabold text-white">500+</div>
              <div class="text-[10px] text-white/40">Applications processed</div>
            </div>
          </div>
        </div>
        <div class="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-emerald-500/30 rounded-xl flex items-center justify-center">
              <i class="fas fa-clock text-emerald-300"></i>
            </div>
            <div>
              <div class="text-lg font-extrabold text-white">99.9%</div>
              <div class="text-[10px] text-white/40">Uptime SLA</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── Features ── -->
    <section id="features" class="py-20 lg:py-28 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <span class="text-xs font-bold text-brand-600 uppercase tracking-[0.2em] bg-brand-50 px-3 py-1 rounded-full">Features</span>
          <h2 class="text-3xl lg:text-4xl font-extrabold text-gray-900 mt-4 mb-3 tracking-tight">Everything you need to manage approvals</h2>
          <p class="text-gray-500 max-w-xl mx-auto">Built for teams that value transparency, speed, and accountability.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="group bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-xl hover:border-brand-100 transition-all duration-300">
            <div class="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-brand-100 transition-colors">
              <i class="fas fa-paper-plane text-brand-600 text-lg"></i>
            </div>
            <h3 class="text-base font-bold text-gray-900 mb-2">Smart Submissions</h3>
            <p class="text-sm text-gray-500 leading-relaxed">Create, edit, and submit applications in seconds. Draft auto-saves so you never lose work.</p>
          </div>
          <div class="group bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-xl hover:border-brand-100 transition-all duration-300">
            <div class="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-amber-100 transition-colors">
              <i class="fas fa-search text-amber-600 text-lg"></i>
            </div>
            <h3 class="text-base font-bold text-gray-900 mb-2">Reviewer Queue</h3>
            <p class="text-sm text-gray-500 leading-relaxed">Prioritized queue with filters and search. Reviewers see only what matters.</p>
          </div>
          <div class="group bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-xl hover:border-brand-100 transition-all duration-300">
            <div class="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-emerald-100 transition-colors">
              <i class="fas fa-history text-emerald-600 text-lg"></i>
            </div>
            <h3 class="text-base font-bold text-gray-900 mb-2">Audit Trail</h3>
            <p class="text-sm text-gray-500 leading-relaxed">Every action logged. Know who did what, when, and why — complete accountability.</p>
          </div>
          <div class="group bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-xl hover:border-brand-100 transition-all duration-300">
            <div class="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-100 transition-colors">
              <i class="fas fa-bell text-purple-600 text-lg"></i>
            </div>
            <h3 class="text-base font-bold text-gray-900 mb-2">Instant Alerts</h3>
            <p class="text-sm text-gray-500 leading-relaxed">Browser notifications on status changes. Never miss an approval or rejection.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ── How It Works ── -->
    <section id="how" class="py-20 lg:py-28 bg-gray-50 relative overflow-hidden">
      <div class="absolute inset-0 opacity-50" style="background-image:radial-gradient(circle,rgba(47,46,139,0.06) 1px,transparent 1px);background-size:24px 24px;"></div>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="text-center mb-16">
          <span class="text-xs font-bold text-brand-600 uppercase tracking-[0.2em] bg-brand-50 px-3 py-1 rounded-full">Process</span>
          <h2 class="text-3xl lg:text-4xl font-extrabold text-gray-900 mt-4 mb-3 tracking-tight">How It Works</h2>
          <p class="text-gray-500 max-w-xl mx-auto">Four simple steps from submission to decision.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          <!-- Connector line -->
          <div class="hidden md:block absolute top-12 left-[12.5%] right-[12.5%] h-0.5 bg-gray-200 z-0"></div>

          <div class="relative z-10 text-center">
            <div class="w-16 h-16 bg-white border-2 border-brand-200 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-brand-100/50">
              <span class="text-xl font-extrabold text-brand-600">1</span>
            </div>
            <div class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h3 class="text-sm font-bold text-gray-900 mb-1">Create & Submit</h3>
              <p class="text-xs text-gray-500">Fill out a simple form and submit for review in one click.</p>
            </div>
          </div>
          <div class="relative z-10 text-center">
            <div class="w-16 h-16 bg-white border-2 border-amber-200 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-100/50">
              <span class="text-xl font-extrabold text-amber-600">2</span>
            </div>
            <div class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h3 class="text-sm font-bold text-gray-900 mb-1">Under Review</h3>
              <p class="text-xs text-gray-500">A reviewer evaluates your application with full context.</p>
            </div>
          </div>
          <div class="relative z-10 text-center">
            <div class="w-16 h-16 bg-white border-2 border-emerald-200 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-100/50">
              <span class="text-xl font-extrabold text-emerald-600">3</span>
            </div>
            <div class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h3 class="text-sm font-bold text-gray-900 mb-1">Decision Made</h3>
              <p class="text-xs text-gray-500">Approved or rejected with clear comments and reasoning.</p>
            </div>
          </div>
          <div class="relative z-10 text-center">
            <div class="w-16 h-16 bg-white border-2 border-purple-200 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-100/50">
              <span class="text-xl font-extrabold text-purple-600">4</span>
            </div>
            <div class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h3 class="text-sm font-bold text-gray-900 mb-1">Full Audit Trail</h3>
              <p class="text-xs text-gray-500">Every action recorded — transparency from start to finish.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── Benefits ── -->
    <section class="py-20 lg:py-28 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span class="text-xs font-bold text-brand-600 uppercase tracking-[0.2em] bg-brand-50 px-3 py-1 rounded-full">Benefits</span>
            <h2 class="text-3xl lg:text-4xl font-extrabold text-gray-900 mt-4 mb-6 tracking-tight">Elevate your workflow with seamless management</h2>
            <div class="space-y-4">
              <div class="flex items-start gap-4">
                <div class="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <i class="fas fa-bolt text-emerald-600"></i>
                </div>
                <div>
                  <h4 class="text-sm font-bold text-gray-900 mb-1">Lightning-Fast Processing</h4>
                  <p class="text-sm text-gray-500">Average approval turnaround under 24 hours. No bottlenecks, no delays.</p>
                </div>
              </div>
              <div class="flex items-start gap-4">
                <div class="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <i class="fas fa-lock text-blue-600"></i>
                </div>
                <div>
                  <h4 class="text-sm font-bold text-gray-900 mb-1">Role-Based Security</h4>
                  <p class="text-sm text-gray-500">Applicants and reviewers have clear permissions. No unauthorized access.</p>
                </div>
              </div>
              <div class="flex items-start gap-4">
                <div class="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <i class="fas fa-chart-line text-purple-600"></i>
                </div>
                <div>
                  <h4 class="text-sm font-bold text-gray-900 mb-1">Actionable Insights</h4>
                  <p class="text-sm text-gray-500">Track metrics, identify bottlenecks, and optimize your approval pipeline.</p>
                </div>
              </div>
            </div>
          </div>
          <div class="relative">
            <div class="bg-gradient-to-br from-brand-600 to-indigo-800 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl">
              <div class="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <div class="relative z-10 space-y-6">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-semibold text-white/60 uppercase tracking-wider">Approval Workflow</span>
                  <span class="bg-emerald-400/20 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full">Active</span>
                </div>
                <div class="space-y-3">
                  <div class="flex items-center justify-between text-sm">
                    <span class="text-white/70">Applications Today</span>
                    <span class="font-bold">47</span>
                  </div>
                  <div class="flex items-center justify-between text-sm">
                    <span class="text-white/70">Approval Rate</span>
                    <span class="font-bold text-emerald-300">98%</span>
                  </div>
                  <div class="flex items-center justify-between text-sm">
                    <span class="text-white/70">Avg. Response</span>
                    <span class="font-bold">3.2h</span>
                  </div>
                  <div class="flex items-center justify-between text-sm">
                    <span class="text-white/70">Pending Reviews</span>
                    <span class="font-bold text-amber-300">12</span>
                  </div>
                </div>
                <div class="h-1 bg-white/10 rounded-full overflow-hidden">
                  <div class="h-full bg-emerald-400 rounded-full" style="width:78%"></div>
                </div>
              </div>
            </div>
            <!-- Floating card -->
            <div class="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-xl border border-gray-100 hidden lg:block">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <i class="fas fa-check text-emerald-600"></i>
                </div>
                <div>
                  <div class="text-lg font-extrabold text-gray-900">250+</div>
                  <div class="text-[10px] text-gray-400">Happy teams</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── CTA ── -->
    <section class="py-20 bg-gradient-to-br from-brand-600 via-brand-700 to-indigo-900 relative overflow-hidden">
      <div class="absolute inset-0 opacity-10" style="background-image:radial-gradient(circle,rgba(255,255,255,0.3) 1px,transparent 1px);background-size:24px 24px;"></div>
      <div class="max-w-4xl mx-auto px-4 text-center relative z-10">
        <h2 class="text-3xl lg:text-4xl font-extrabold text-white tracking-tight mb-4">Ready to streamline your approvals?</h2>
        <p class="text-white/60 text-lg mb-8 max-w-xl mx-auto">Join teams already using Open Ownership for transparent, accountable workflows.</p>
        <div class="flex flex-wrap justify-center gap-3">
          <button @click="$router.push('/signup')" class="bg-white hover:bg-gray-50 text-brand-700 px-8 py-3.5 text-sm font-bold rounded-lg transition-all shadow-xl flex items-center gap-2">
            Get Started Free <i class="fas fa-arrow-right text-xs"></i>
          </button>
          <button @click="$router.push('/login')" class="border border-white/25 hover:border-white/50 text-white px-8 py-3.5 text-sm font-semibold rounded-lg transition-all">
            Sign In
          </button>
        </div>
      </div>
    </section>

    <!-- ── Footer ── -->
    <footer class="bg-gray-900 py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row items-center justify-between gap-6">
          <AppLogo dark />
          <div class="flex items-center gap-6">
            <a href="#" class="text-xs text-gray-500 hover:text-white transition-colors">Privacy</a>
            <a href="#" class="text-xs text-gray-500 hover:text-white transition-colors">Terms</a>
            <a href="#" class="text-xs text-gray-500 hover:text-white transition-colors">Contact</a>
          </div>
          <p class="text-xs text-gray-500">© 2026 Open Ownership. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import AppLogo from '@/components/AppLogo.vue'
</script>
