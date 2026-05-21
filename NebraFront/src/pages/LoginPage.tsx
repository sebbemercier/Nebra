import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { apiClient } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { ShieldCheck, ArrowRight, Sparkles, Lock, Mail, User, AlertCircle, Monitor } from 'lucide-react'

export function LoginPage() {
  const navigate = useNavigate()
  const { setToken } = useAuth()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')

  const loginMutation = useMutation({
    mutationFn: ({ userEmail, userPassword }: { userEmail: string; userPassword: string }) =>
      apiClient.login(userEmail, userPassword),
    onSuccess: (result) => {
      setToken(result.access_token)
      navigate('/dashboard')
    },
  })

  const registerMutation = useMutation({
    mutationFn: ({ userEmail, userFullName, userPassword }: { userEmail: string; userFullName: string; userPassword: string }) =>
      apiClient.register({ email: userEmail, full_name: userFullName, password: userPassword }),
    onSuccess: (_, variables) => {
      loginMutation.mutate({ userEmail: variables.userEmail, userPassword: variables.userPassword })
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (mode === 'login') {
      loginMutation.mutate({ userEmail: email, userPassword: password })
    } else {
      registerMutation.mutate({ userEmail: email, userFullName: fullName, userPassword: password })
    }
  }

  const isPending = loginMutation.isPending || registerMutation.isPending
  const error = loginMutation.error || registerMutation.error

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0a0a0f]">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-nebra-blue/5 via-transparent to-network-teal/5" />
        <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-nebra-blue/10 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-0 -right-1/4 w-1/2 h-1/2 bg-network-teal/10 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '6s', animationDelay: '2s' }} />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.015]" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center p-6">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left side - Branding */}
          <div className="hidden lg:block space-y-8 animate-in fade-in slide-in-from-left duration-1000">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-nebra-blue/10 border border-nebra-blue/20 backdrop-blur-sm">
                <Sparkles className="h-4 w-4 text-nebra-blue animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-nebra-blue">ITAM & CMDB</span>
              </div>
              
              <h1 className="text-6xl font-black tracking-tight text-white leading-tight">
                IT Asset
                <br />
                <span className="bg-gradient-to-r from-nebra-blue via-network-teal to-nebra-blue bg-clip-text text-transparent animate-gradient">
                  Intelligence
                </span>
              </h1>
              
              <p className="text-xl text-slate-400 leading-relaxed max-w-lg">
                Plateforme moderne de gestion d'inventaire avec agent intelligent. 
                Suivez le cycle de vie complet de vos équipements en temps réel.
              </p>
            </div>

            <div className="space-y-4 pt-8">
              {[
                { icon: Monitor, title: 'Agent Intelligent', desc: 'Auto-découverte hardware' },
                { icon: Sparkles, title: 'Temps Réel', desc: 'Monitoring & heartbeat' },
                { icon: ShieldCheck, title: 'Cycle de Vie', desc: 'Stock à archivage' }
              ].map((feature, i) => (
                <div 
                  key={i}
                  className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5 backdrop-blur-sm hover:bg-white/[0.04] transition-all duration-300"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="p-2 rounded-lg bg-gradient-to-br from-nebra-blue/20 to-network-teal/20">
                    <feature.icon className="h-5 w-5 text-nebra-blue" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{feature.title}</h3>
                    <p className="text-xs text-slate-500">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right side - Auth Form */}
          <div className="animate-in fade-in slide-in-from-right duration-1000 delay-300">
            <div className="relative rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-xl p-8 shadow-2xl">
              {/* Glow effect */}
              <div className="absolute -inset-[1px] bg-gradient-to-r from-nebra-blue/20 via-network-teal/20 to-nebra-blue/20 rounded-3xl blur-xl -z-10 opacity-50" />
              
              <div className="space-y-6">
                {/* Header */}
                <div className="text-center space-y-3">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-nebra-blue to-network-teal">
                    <ShieldCheck className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="text-3xl font-black text-white tracking-tight">
                    {mode === 'login' ? 'Welcome Back' : 'Get Started'}
                  </h2>
                  <p className="text-sm text-slate-400">
                    {mode === 'login' 
                      ? 'Sign in to access your dashboard' 
                      : 'Create your account in seconds'}
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {mode === 'register' && (
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-nebra-blue/50 focus:border-transparent transition-all"
                          placeholder="John Doe"
                          required
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-nebra-blue/50 focus:border-transparent transition-all"
                        placeholder="you@company.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-nebra-blue/50 focus:border-transparent transition-all"
                        placeholder="••••••••"
                        required
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                      <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0" />
                      <p className="text-xs text-red-400">{(error as Error).message}</p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={isPending}
                    className="w-full h-12 rounded-xl bg-gradient-to-r from-nebra-blue to-network-teal hover:opacity-90 transition-all font-bold text-white shadow-lg shadow-nebra-blue/25 group"
                  >
                    {isPending ? (
                      <span className="flex items-center gap-2">
                        <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Processing...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        {mode === 'login' ? 'Sign In' : 'Create Account'}
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    )}
                  </Button>
                </form>

                {/* Toggle mode */}
                <div className="pt-4 border-t border-white/5 text-center">
                  <button
                    type="button"
                    onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {mode === 'login' ? (
                      <>Don't have an account? <span className="text-nebra-blue font-semibold">Sign up</span></>
                    ) : (
                      <>Already have an account? <span className="text-nebra-blue font-semibold">Sign in</span></>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
