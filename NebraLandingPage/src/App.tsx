import { 
  ShieldCheck, 
  Sparkles, 
  Monitor, 
  Package, 
  Activity, 
  Zap,
  CheckCircle2,
  ArrowRight,
  Server,
  Lock,
  Clock,
  Code2
} from 'lucide-react'

function App() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-nebra-blue/10 via-transparent to-network-teal/10" />
        <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-nebra-blue/20 rounded-full blur-[150px] animate-pulse-slow" />
        <div className="absolute bottom-0 -right-1/4 w-1/2 h-1/2 bg-network-teal/20 rounded-full blur-[150px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
        
        {/* Grid overlay */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      {/* Header */}
      <header className="container mx-auto px-6 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-nebra-blue to-network-teal flex items-center justify-center">
              <Monitor className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tight">Nebra</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#features" className="text-sm text-slate-400 hover:text-white transition-colors">
              Fonctionnalités
            </a>
            <a href="#tech" className="text-sm text-slate-400 hover:text-white transition-colors">
              Technologie
            </a>
            <a 
              href="https://github.com/sebbemercier/Nebra" 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-sm"
            >
              <Code2 className="h-4 w-4" />
              GitHub
            </a>
            <a 
              href="http://localhost:5173" 
              className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-nebra-blue to-network-teal hover:opacity-90 transition-all font-semibold text-sm shadow-lg shadow-nebra-blue/25"
            >
              Démarrer
            </a>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-nebra-blue/10 border border-nebra-blue/20 backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-nebra-blue animate-pulse" />
              <span className="text-sm font-bold text-nebra-blue">Open Source • ITAM & CMDB</span>
            </div>

            <h1 className="text-6xl lg:text-7xl font-black tracking-tight leading-none">
              Gestion d'actifs IT
              <br />
              <span className="bg-gradient-to-r from-nebra-blue via-network-teal to-nebra-blue bg-clip-text text-transparent">
                en temps réel
              </span>
            </h1>

            <p className="text-xl text-slate-400 leading-relaxed max-w-xl">
              Plateforme moderne de gestion d'inventaire informatique avec agent intelligent. 
              Suivez le cycle de vie complet de vos équipements de l'achat à la mise au rebut.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <a 
                href="http://localhost:5173" 
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-nebra-blue to-network-teal hover:opacity-90 transition-all font-bold text-lg shadow-2xl shadow-nebra-blue/30 group"
              >
                Essayer maintenant
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <a 
                href="https://github.com/sebbemercier/Nebra" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all font-bold text-lg"
              >
                <Code2 className="h-5 w-5" />
                Voir le code
              </a>
            </div>

            <div className="flex items-center gap-8 pt-4">
              {[
                { label: 'Open Source', value: 'MIT' },
                { label: 'Version', value: 'v0.1.0' },
                { label: 'Stack', value: 'FastAPI + React' }
              ].map((stat, i) => (
                <div key={i}>
                  <div className="text-2xl font-black text-white">{stat.value}</div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Visual */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-nebra-blue/20 to-network-teal/20 rounded-3xl blur-3xl" />
            <div className="relative rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-xl p-8 shadow-2xl">
              <div className="space-y-4">
                {/* Mock terminal */}
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  <span className="text-xs text-slate-500 ml-2 font-mono">nebra-dashboard</span>
                </div>

                {/* Stats cards */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 rounded-xl bg-nebra-blue/10 border border-nebra-blue/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Package className="h-4 w-4 text-nebra-blue" />
                      <span className="text-xs text-slate-400">Assets</span>
                    </div>
                    <div className="text-3xl font-black">147</div>
                  </div>
                  <div className="p-4 rounded-xl bg-network-teal/10 border border-network-teal/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="h-4 w-4 text-network-teal" />
                      <span className="text-xs text-slate-400">Active</span>
                    </div>
                    <div className="text-3xl font-black">89</div>
                  </div>
                </div>

                {/* Activity feed */}
                <div className="space-y-2 pt-2">
                  {[
                    { icon: CheckCircle2, text: 'MacBook Pro déployé', time: '2m ago', color: 'text-green-400' },
                    { icon: Activity, text: 'Agent heartbeat reçu', time: '5m ago', color: 'text-nebra-blue' },
                    { icon: Package, text: 'Nouveau stock ajouté', time: '12m ago', color: 'text-network-teal' }
                  ].map((item, i) => (
                    <div 
                      key={i} 
                      className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/5 animate-float"
                      style={{ animationDelay: `${i * 0.2}s` }}
                    >
                      <item.icon className={`h-4 w-4 ${item.color}`} />
                      <div className="flex-1">
                        <div className="text-sm text-white">{item.text}</div>
                        <div className="text-xs text-slate-500">{item.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-6">
            <Zap className="h-4 w-4 text-nebra-blue" />
            <span className="text-sm font-bold">Fonctionnalités</span>
          </div>
          <h2 className="text-5xl font-black mb-4">Tout ce dont vous avez besoin</h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Une plateforme complète pour gérer l'ensemble de votre parc informatique
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: Monitor,
              title: 'Agent Intelligent',
              description: 'Auto-découverte automatique des informations hardware (CPU, RAM, Disques, Réseau)',
              color: 'nebra-blue'
            },
            {
              icon: Activity,
              title: 'Monitoring en Temps Réel',
              description: 'Heartbeat continu pour suivre l\'état Online/Offline de vos machines',
              color: 'network-teal'
            },
            {
              icon: Package,
              title: 'Gestion du Cycle de Vie',
              description: 'Suivez vos assets : EN STOCK, DÉPLOYÉ, MAINTENANCE, ARCHIVÉ',
              color: 'nebra-blue'
            },
            {
              icon: CheckCircle2,
              title: 'Check-in / Check-out',
              description: 'Attribuez du matériel à vos collaborateurs en un clic',
              color: 'network-teal'
            },
            {
              icon: Clock,
              title: 'Audit Trail Complet',
              description: 'Historique indélébile de chaque mouvement ou modification',
              color: 'nebra-blue'
            },
            {
              icon: Lock,
              title: 'Sécurité Renforcée',
              description: 'Rôles granulaires et authentification JWT pour utilisateurs et agents',
              color: 'network-teal'
            }
          ].map((feature, i) => (
            <div 
              key={i}
              className="group p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:bg-white/[0.05] hover:border-white/20 transition-all duration-300"
            >
              <div className={`inline-flex p-3 rounded-xl bg-${feature.color}/10 border border-${feature.color}/20 mb-4 group-hover:scale-110 transition-transform`}>
                <feature.icon className={`h-6 w-6 text-${feature.color}`} />
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-slate-400 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tech Stack Section */}
      <section id="tech" className="container mx-auto px-6 py-20">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-xl p-12 lg:p-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-6">
                <Server className="h-4 w-4 text-nebra-blue" />
                <span className="text-sm font-bold">Stack Technique</span>
              </div>
              <h2 className="text-4xl font-black mb-4">Technologies Modernes</h2>
              <p className="text-lg text-slate-400 mb-8">
                Construit avec les meilleures technologies pour garantir performance, 
                scalabilité et maintenabilité
              </p>

              <div className="space-y-4">
                {[
                  { label: 'Backend', value: 'FastAPI + SQLAlchemy 2.0' },
                  { label: 'Frontend', value: 'React 19 + TailwindCSS' },
                  { label: 'Database', value: 'PostgreSQL 18 / CockroachDB' },
                  { label: 'Agent', value: 'Python 3.11+ + psutil' },
                  { label: 'Infra', value: 'Docker + Docker Compose' }
                ].map((tech, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-24 text-sm text-slate-500 font-semibold">{tech.label}</div>
                    <div className="flex-1 h-px bg-gradient-to-r from-white/20 to-transparent" />
                    <div className="text-sm font-bold">{tech.value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-6 rounded-xl bg-white/[0.02] border border-white/10">
                <h3 className="text-lg font-bold mb-3">🚀 Démarrage Rapide</h3>
                <div className="font-mono text-sm text-slate-400 space-y-2">
                  <div className="bg-black/30 rounded px-3 py-2">
                    <span className="text-network-teal">git</span> clone https://github.com/sebbemercier/Nebra
                  </div>
                  <div className="bg-black/30 rounded px-3 py-2">
                    <span className="text-network-teal">docker-compose</span> up --build
                  </div>
                  <div className="bg-black/30 rounded px-3 py-2">
                    <span className="text-slate-500"># Frontend:</span> localhost:5173
                  </div>
                  <div className="bg-black/30 rounded px-3 py-2">
                    <span className="text-slate-500"># API:</span> localhost:8000/docs
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-xl bg-gradient-to-br from-nebra-blue/10 to-transparent border border-nebra-blue/20">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="h-5 w-5 text-nebra-blue flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold mb-1">Licence MIT</h3>
                    <p className="text-sm text-slate-400">
                      Libre d'utilisation, de modification et de distribution
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="relative rounded-3xl border border-white/10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-nebra-blue/20 to-network-teal/20 blur-3xl" />
          <div className="relative bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-xl p-12 lg:p-20 text-center">
            <h2 className="text-5xl font-black mb-6">
              Prêt à moderniser votre
              <br />
              gestion d'actifs IT ?
            </h2>
            <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
              Rejoignez les équipes qui font confiance à Nebra pour gérer leur infrastructure
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a 
                href="http://localhost:5173" 
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-nebra-blue to-network-teal hover:opacity-90 transition-all font-bold text-lg shadow-2xl shadow-nebra-blue/30 group"
              >
                Commencer maintenant
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <a 
                href="https://github.com/sebbemercier/Nebra" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all font-bold text-lg"
              >
                <Code2 className="h-5 w-5" />
                Star sur GitHub
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-12 border-t border-white/10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-nebra-blue to-network-teal flex items-center justify-center">
              <Monitor className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-black">Nebra</span>
          </div>
          <div className="text-sm text-slate-500">
            © 2024 Nebra. Distribué sous licence MIT.
          </div>
          <div className="flex items-center gap-6">
            <a 
              href="https://github.com/sebbemercier/Nebra" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-white transition-colors"
            >
              <Code2 className="h-5 w-5" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
