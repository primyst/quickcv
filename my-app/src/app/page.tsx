'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { ArrowRight, Zap, FileText, Share2, CheckCircle2 } from 'lucide-react'

export default function LandingPage() {
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession()
      const session = data.session
      if (session) {
        router.push('/dashboard')
      } else {
        setIsChecking(false)
      }
    }
    checkSession()
  }, [router])

  const handleLogin = async () => {
    setIsLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) {
      console.error('Login error:', error.message)
      setIsLoading(false)
    }
  }

  if (isChecking) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-blue-400 border-t-blue-200 rounded-full animate-spin" />
          <p className="text-slate-300 text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  const features = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Convert documents in seconds with AI-powered processing'
    },
    {
      icon: FileText,
      title: 'Any Format',
      description: 'Works with PDFs, images, scans, and more'
    },
    {
      icon: Share2,
      title: 'Instantly Shareable',
      description: 'Download, edit, and collaborate with ease'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-blue-900 text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-40 right-20 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="pt-6 px-6 sm:px-8">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-200 to-blue-100 bg-clip-text text-transparent">
                SnapToDoc
              </span>
            </div>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-6 py-2 text-slate-300 hover:text-white transition-colors text-sm font-medium"
            >
              Dashboard
            </button>
          </div>
        </header>

        {/* Hero Section */}
        <section className="px-6 sm:px-8 py-20 sm:py-32">
          <div className="max-w-4xl mx-auto text-center space-y-8 animate-fadeIn">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-400/30 rounded-full text-sm text-blue-200">
              <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
              Now with OCR enhancement
            </div>

            {/* Main headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
              Turn Paper into
              <span className="block bg-gradient-to-r from-blue-200 via-blue-300 to-blue-100 bg-clip-text text-transparent mt-2">
                Editable Files Instantly
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
              SnapToDoc converts any printed or scanned document into perfectly formatted, editable files. No manual typing. No frustration. Just instant results.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button
                onClick={handleLogin}
                disabled={isLoading}
                className="group relative px-8 sm:px-10 py-3 sm:py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:opacity-70 disabled:cursor-not-allowed text-white font-semibold text-lg rounded-xl shadow-2xl hover:shadow-blue-500/50 transition-all transform hover:-translate-y-1 active:translate-y-0 flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Try for Free
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
              <button
                onClick={() => router.push('/docs')}
                className="px-8 sm:px-10 py-3 sm:py-4 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600 hover:border-slate-500 text-white font-semibold text-lg rounded-xl transition-all transform hover:-translate-y-1 active:translate-y-0"
              >
                Learn More
              </button>
            </div>

            {/* Trust badges */}
            <div className="pt-4 space-y-2">
              <p className="text-sm text-slate-400 font-medium">
                🎁 Free 5 conversions per week · Premium coming soon
              </p>
              <p className="text-xs text-slate-500">
                No credit card required · Takes less than 30 seconds
              </p>
            </div>
          </div>

          {/* Features Grid */}
          <div className="max-w-5xl mx-auto mt-24">
            <div className="grid md:grid-cols-3 gap-6">
              {features.map((feature, idx) => {
                const Icon = feature.icon
                return (
                  <div
                    key={idx}
                    className="group p-6 sm:p-8 bg-slate-800/50 hover:bg-slate-800/80 border border-slate-700 hover:border-blue-500/50 rounded-2xl transition-all duration-300 transform hover:-translate-y-2"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                    <p className="text-slate-400 leading-relaxed">{feature.description}</p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Social Proof */}
          <div className="max-w-5xl mx-auto mt-24 grid sm:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-3xl sm:text-4xl font-bold text-blue-300">10k+</div>
              <p className="text-slate-400 text-sm">Conversions completed</p>
            </div>
            <div className="space-y-2">
              <div className="text-3xl sm:text-4xl font-bold text-blue-300">99.9%</div>
              <p className="text-slate-400 text-sm">Accuracy rate</p>
            </div>
            <div className="space-y-2">
              <div className="text-3xl sm:text-4xl font-bold text-blue-300">&lt;30sec</div>
              <p className="text-slate-400 text-sm">Average processing time</p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-slate-700/50 mt-24 py-12 px-6 sm:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="grid sm:grid-cols-4 gap-8 mb-8 pb-8 border-b border-slate-700/50">
              <div>
                <h4 className="font-semibold text-white mb-4">Product</h4>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-4">Company</h4>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-4">Legal</h4>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-4">Social</h4>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">GitHub</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">LinkedIn</a></li>
                </ul>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-between">
              <p className="text-slate-500 text-sm">© {new Date().getFullYear()} SnapToDoc. All rights reserved.</p>
              <p className="text-slate-500 text-sm mt-4 sm:mt-0">Built with ❤️ for productivity</p>
            </div>
          </div>
        </footer>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out;
        }
        .delay-1000 {
          animation-delay: 1000ms;
        }
        .delay-500 {
          animation-delay: 500ms;
        }
      `}</style>
    </div>
  )
}