import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import { 
  ShieldCheck, Sparkles, Monitor, Package, Activity, Zap, 
  CheckCircle2, ArrowRight, Server, Lock, Clock, Cpu, Network,
  Database, Boxes, Workflow, Terminal, Bell, Globe, Check, Star, 
  HardDrive, Layout, Users, Map, Code2, MessageSquare, Mail, 
  Smartphone, BookOpen, HelpCircle, Copy, Check as CheckIcon,
  Pulse, BarChart3, History, Layers, Eye, Shield, Cpu as CpuIcon
} from 'lucide-react'
import { useEffect, useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// --- Shared Components ---

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled || location.pathname !== '/' ? 'bg-black/95 backdrop-blur-3xl border-b border-white/10 py-4' : 'bg-transparent py-8'}`}
    >
      <nav className="container mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <motion.img 
            whileHover={{ rotate: 15, scale: 1.1 }}
            src="/logo-icon.png" 
            alt="Nebra Icon" 
            className="w-10 h-10 object-contain" 
          />
          <div className="flex flex-col">
            <span className="text-2xl font-black tracking-tighter">NEBRA</span>
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-nebra-blue leading-none">Intelligence</span>
          </div>
        </Link>
        
        <div className="hidden md:flex items-center gap-8">
          {[
            { name: 'Features', path: '/features' },
            { name: 'Roadmap', path: '/roadmap' },
            { name: 'Tarifs', path: '/pricing' },
            { name: 'Status', path: '/status' },
            { name: 'Blog', path: '/blog' },
          ].map((item) => (
            <Link 
              key={item.path}
              to={item.path} 
              className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:text-nebra-blue relative group ${location.pathname === item.path ? 'text-white' : 'text-slate-400'}`}
            >
              {item.name}
              <motion.span 
                initial={false}
                animate={{ width: location.pathname === item.path ? '100%' : '0%' }}
                className="absolute -bottom-2 left-0 h-0.5 bg-nebra-blue"
              />
            </Link>
          ))}
          <a href="http://localhost:5173" className="relative group px-6 py-2.5 rounded-full bg-white text-black font-black text-xs overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-xl shadow-white/10">
            <div className="absolute inset-0 bg-nebra-blue translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <span className="relative group-hover:text-white transition-colors uppercase">Console</span>
          </a>
        </div>
      </nav>
    </motion.header>
  )
}

const Footer = () => (
  <footer className="py-24 border-t border-white/5 bg-[#010103] relative overflow-hidden">
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-nebra-blue/50 to-transparent" />
    <div className="container mx-auto px-6 relative z-10">
      <div className="grid md:grid-cols-4 gap-16 mb-20">
        <div className="col-span-1 md:col-span-2">
          <img src="/logo-full.png" alt="Nebra Logo" className="h-14 mb-8 object-contain brightness-0 invert" />
          <p className="text-slate-500 max-w-sm text-lg leading-relaxed font-medium">
            La plateforme ITAM & CMDB open-source conçue pour la visibilité totale de votre infrastructure.
          </p>
        </div>
        <div>
          <h4 className="font-black mb-8 text-white uppercase tracking-[0.2em] text-[10px]">Navigation</h4>
          <ul className="space-y-4 text-sm text-slate-500 font-bold">
            <li><Link to="/features" className="hover:text-nebra-blue transition-colors">Fonctionnalités</Link></li>
            <li><Link to="/status" className="hover:text-nebra-blue transition-colors">Network Status</Link></li>
            <li><Link to="/roadmap" className="hover:text-nebra-blue transition-colors">Roadmap</Link></li>
            <li><Link to="/blog" className="hover:text-nebra-blue transition-colors">Changelog</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-black mb-8 text-white uppercase tracking-[0.2em] text-[10px]">Support</h4>
          <ul className="space-y-4 text-sm text-slate-500 font-bold">
            <li><a href="https://github.com/sebbemercier/Nebra" className="hover:text-nebra-blue transition-colors">GitHub</a></li>
            <li><Link to="/contact" className="hover:text-nebra-blue transition-colors">Contact</Link></li>
            <li><a href="#" className="hover:text-nebra-blue transition-colors">Documentation</a></li>
          </ul>
        </div>
      </div>
      <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="text-[10px] text-slate-600 font-black uppercase tracking-[0.3em]">
          © 2026 NEBRA INTELLIGENCE • DISTRIBUÉ SOUS LICENCE MIT
        </div>
        <div className="flex gap-8">
          <Code2 className="h-5 w-5 text-slate-700 hover:text-white cursor-pointer transition-all hover:scale-125" />
          <Globe className="h-5 w-5 text-slate-700 hover:text-white cursor-pointer transition-all hover:scale-125" />
        </div>
      </div>
    </div>
  </footer>
)

const PageWrapper = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.5 }}
  >
    {children}
  </motion.div>
)

// --- Pages ---

const HomePage = () => {
  const [activeLogs, setActiveLogs] = useState<string[]>([
    "Scanning PCIe lanes...",
    "Retrieving BIOS UUID...",
    "Nebra Agent handshake [SUCCESS]"
  ])

  useEffect(() => {
    const logs = [
      "Hardware: CPU i9-14900K mapped",
      "Network: 10GbE link established",
      "Asset tagged: FR-PAR-SVR-01",
      "Event: Thermal throttle on Node-7",
      "Registry: New agent joined cluster",
      "Update: Kernel version detected v6.12"
    ]
    const interval = setInterval(() => {
      setActiveLogs(prev => [logs[Math.floor(Math.random() * logs.length)], ...prev.slice(0, 3)])
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <PageWrapper>
      <section className="relative pt-48 pb-32 lg:pt-64 lg:pb-48 overflow-hidden">
        <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-24 items-center">
          <div className="relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-2xl mb-10"
            >
              <div className="w-2 h-2 rounded-full bg-nebra-blue animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">Next-Gen ITAM & CMDB</span>
            </motion.div>
            
            <h1 className="text-8xl lg:text-9xl font-black tracking-tighter leading-[0.85] mb-10">
              Le Signal <br />
              <span className="text-gradient italic">Infra.</span>
            </h1>
            
            <p className="text-2xl text-slate-400 leading-relaxed max-w-xl mb-12 font-medium">
              Plus qu'un inventaire. Nebra fusionne la gestion de stock et l'intelligence hardware en temps réel.
            </p>

            <div className="flex flex-wrap items-center gap-6">
              <a href="http://localhost:5173" className="relative group px-12 py-6 rounded-2xl bg-nebra-blue overflow-hidden transition-all hover:shadow-[0_0_60px_-15px_#007BFF] hover:scale-105 active:scale-95">
                <span className="relative flex items-center gap-3 font-black text-xl text-white">
                  DÉPLOYER <ArrowRight className="h-6 w-6" />
                </span>
              </a>
              <Link to="/features" className="px-10 py-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all font-black text-xl flex items-center gap-3">
                FEATURES
              </Link>
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-nebra-blue/20 rounded-full blur-[120px] animate-pulse" />
            <div className="bg-gradient-to-br from-white/[0.08] to-transparent border border-white/20 backdrop-blur-3xl rounded-[40px] p-10 relative shadow-2xl group">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <Monitor className="h-8 w-8 text-nebra-blue" />
                  <span className="text-sm font-black text-white tracking-[0.4em] uppercase">Fleet Status</span>
                </div>
                <Activity className="h-6 w-6 text-network-teal animate-pulse" />
              </div>
              <div className="space-y-4 font-mono">
                {activeLogs.map((log, i) => (
                  <motion.div 
                    key={log}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 - (i * 0.2) }}
                    className="text-xs text-slate-300 flex gap-4"
                  >
                    <span className="text-nebra-blue">»</span>
                    <span>{log}</span>
                  </motion.div>
                ))}
              </div>
              <div className="mt-10 pt-10 border-t border-white/10 grid grid-cols-2 gap-8">
                <div>
                  <div className="text-[10px] text-slate-500 font-black uppercase mb-1">Assets Managed</div>
                  <div className="text-3xl font-black text-white">1,402</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 font-black uppercase mb-1">Global Health</div>
                  <div className="text-3xl font-black text-network-teal">99.8%</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </PageWrapper>
  )
}

const StatusPage = () => {
  const regions = [
    { name: 'Europe-West (Paris)', status: 'Operational', latency: '12ms', load: 14 },
    { name: 'US-East (Virginia)', status: 'Operational', latency: '85ms', load: 32 },
    { name: 'Asia-South (Tokyo)', status: 'Maintenance', latency: '240ms', load: 0 }
  ]

  return (
    <PageWrapper>
      <section className="pt-56 pb-48 relative overflow-hidden min-h-screen">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mb-32">
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-network-teal/10 border border-network-teal/20 backdrop-blur-md mb-8">
              <Globe className="h-5 w-5 text-network-teal" />
              <span className="text-xs font-black uppercase tracking-[0.2em] text-network-teal">NETWORK LIVE STATUS</span>
            </div>
            <h2 className="text-8xl font-black mb-10 tracking-tighter leading-none">Global <br /><span className="text-gradient">Pulse.</span></h2>
            <p className="text-2xl text-slate-400 font-medium">Monitoring en temps réel de l'infrastructure Cloud Nebra.</p>
          </div>

          <div className="grid gap-6">
            {regions.map((region, i) => (
              <motion.div 
                key={i}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/[0.03] border border-white/10 p-8 rounded-[2rem] flex flex-wrap items-center justify-between gap-8 group hover:bg-white/[0.05] transition-all"
              >
                <div className="flex items-center gap-6">
                  <div className={`w-3 h-3 rounded-full ${region.status === 'Operational' ? 'bg-network-teal' : 'bg-amber-500'} animate-pulse`} />
                  <div>
                    <h3 className="text-xl font-bold">{region.name}</h3>
                    <p className="text-xs font-black uppercase text-slate-500 mt-1">{region.status}</p>
                  </div>
                </div>
                <div className="flex items-center gap-16">
                  <div className="text-center">
                    <div className="text-[10px] font-black uppercase text-slate-500 mb-1">Latency</div>
                    <div className="font-mono text-white">{region.latency}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-[10px] font-black uppercase text-slate-500 mb-1">Load</div>
                    <div className="font-mono text-white">{region.load}%</div>
                  </div>
                  <BarChart3 className="h-6 w-6 text-slate-600 group-hover:text-nebra-blue transition-colors" />
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-24 bg-nebra-blue/10 border border-nebra-blue/20 p-12 rounded-[3rem] text-center">
            <h3 className="text-3xl font-black mb-4 italic">99.99% Uptime Global</h3>
            <p className="text-slate-400 font-medium">Notre infrastructure est conçue pour la haute disponibilité et la tolérance aux pannes.</p>
          </div>
        </div>
      </section>
    </PageWrapper>
  )
}

const BlogPage = () => {
  const posts = [
    { title: 'Lancement de Nebra Agent v0.1.0', date: '22 Mai 2026', tag: 'Release', desc: 'Auto-découverte hardware et heartbeat WebSocket enfin disponibles.' },
    { title: 'Sécurité : Chiffrement de bout en bout', date: '15 Mai 2026', tag: 'Security', desc: 'Comment nous protégeons les données de vos équipements.' },
    { title: 'Migration CMDB : Guide complet', date: '10 Mai 2026', tag: 'Guide', desc: 'Transférez votre inventaire Excel vers Nebra en 5 minutes.' }
  ]

  return (
    <PageWrapper>
      <section className="pt-56 pb-48 relative min-h-screen">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mb-32">
            <h2 className="text-8xl font-black mb-10 tracking-tighter leading-none">Inside <br /><span className="text-gradient">Nebra.</span></h2>
            <p className="text-2xl text-slate-400 font-medium leading-relaxed">Les dernières nouvelles, guides et mises à jour techniques.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {posts.map((post, i) => (
              <motion.article 
                key={i}
                whileHover={{ y: -10 }}
                className="bg-white/[0.03] border border-white/10 rounded-[2.5rem] overflow-hidden group cursor-pointer"
              >
                <div className="h-48 bg-gradient-to-br from-nebra-blue/20 to-nebra-accent/20 flex items-center justify-center p-12 transition-all group-hover:scale-105">
                  <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-xl flex items-center justify-center">
                    <History className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div className="p-10">
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-[10px] font-black uppercase tracking-widest text-nebra-blue">{post.tag}</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">{post.date}</span>
                  </div>
                  <h3 className="text-2xl font-black mb-4 group-hover:text-nebra-blue transition-colors">{post.title}</h3>
                  <p className="text-slate-500 font-medium leading-relaxed mb-8">{post.desc}</p>
                  <div className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-white group-hover:gap-4 transition-all">
                    Lire plus <ChevronRight className="h-4 w-4 text-nebra-blue" />
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </PageWrapper>
  )
}

const FeaturesPage = () => {
  const hardwareInfo = [
    { key: 'CPU', value: 'Intel(R) Core(TM) i9-14900K @ 3.20GHz', icon: CpuIcon },
    { key: 'Memory', value: '64 GB DDR5-6000MHz (2/4 Slots)', icon: Layers },
    { key: 'Storage', value: 'Samsung 990 Pro 2TB NVMe (Health: 99%)', icon: HardDrive },
    { key: 'Network', value: 'Ethernet 10Gbps (Local: 192.168.1.47)', icon: Network }
  ]

  return (
    <PageWrapper>
      <section className="pt-56 pb-48">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mb-32">
            <h2 className="text-8xl font-black mb-10 tracking-tighter leading-none">L'Intelligence <br /><span className="text-gradient">Hardware.</span></h2>
            <p className="text-2xl text-slate-400 font-medium">Découvrez ce que l'agent Nebra voit réellement sous le capot.</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-24 items-center mb-32">
            <div className="space-y-12">
              {[
                { title: 'Zero Manual Input', desc: 'L\'agent détecte automatiquement les numéros de série, UUID, versions de BIOS et configurations réseau.', color: 'nebra-blue' },
                { title: 'Heartbeat Pulse', desc: 'Un signal WebSocket persistant qui maintient l\'état en temps réel sans latence.', color: 'network-teal' },
                { title: 'Security Hardened', desc: 'Signatures JWT et communications chiffrées (TLS 1.3) pour chaque interaction.', color: 'nebra-accent' }
              ].map((f, i) => (
                <div key={i} className="flex gap-8 group">
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex-shrink-0 flex items-center justify-center font-black text-slate-500 group-hover:bg-nebra-blue/20 group-hover:text-nebra-blue transition-all">
                    0{i+1}
                  </div>
                  <div>
                    <h3 className="text-2xl font-black mb-3">{f.title}</h3>
                    <p className="text-lg text-slate-500 font-medium leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-white/[0.03] border border-white/10 p-12 rounded-[3rem] backdrop-blur-3xl shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-nebra-blue to-nebra-accent" />
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                  <Terminal className="h-6 w-6 text-nebra-blue" />
                  <span className="text-xs font-black uppercase tracking-[0.3em]">Deep-Scan Simulator</span>
                </div>
                <div className="px-3 py-1 rounded-md bg-network-teal/20 text-network-teal text-[10px] font-black animate-pulse uppercase">Live Data</div>
              </div>
              <div className="space-y-6">
                {hardwareInfo.map((info, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.2 }}
                    className="p-6 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-6 group-hover:bg-white/10 transition-all"
                  >
                    <info.icon className="h-6 w-6 text-slate-400 group-hover:text-nebra-blue transition-colors" />
                    <div>
                      <div className="text-[10px] font-black uppercase text-slate-500 mb-1">{info.key}</div>
                      <div className="text-sm font-bold text-white truncate max-w-[280px]">{info.value}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageWrapper>
  )
}

// --- Roadmap, Pricing, Contact remain similar but with consistent styling ---

const RoadmapPage = () => (
  <PageWrapper>
    <section className="pt-56 pb-48">
      <div className="container mx-auto px-6">
        <h2 className="text-8xl font-black mb-32 tracking-tighter leading-none">Vision.</h2>
        <div className="space-y-12 max-w-5xl">
          {[
            { phase: 'Phase 1', title: 'Fondations CMDB', status: 'Complété', color: 'network-teal' },
            { phase: 'Phase 2', title: 'Real-time WebSocket Pulse', status: 'En cours', color: 'nebra-blue' },
            { phase: 'Phase 3', title: 'Automation Enterprise Sync', status: 'Planifié', color: 'nebra-accent' },
            { phase: 'Phase 4', title: 'Mobile Field Ecosystem', status: 'Futur', color: 'slate-600' }
          ].map((item, i) => (
            <div key={i} className="relative pl-12 border-l-2 border-white/10 group">
              <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-white/20 group-hover:bg-nebra-blue transition-all shadow-[0_0_15px_rgba(0,123,255,0.5)]" />
              <div className="bg-white/[0.03] border border-white/10 p-10 rounded-[2.5rem] group-hover:bg-white/[0.05] transition-all">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">{item.phase}</span>
                  <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-white/5 border border-white/10">{item.status}</span>
                </div>
                <h3 className="text-3xl font-black">{item.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  </PageWrapper>
)

const PricingPage = () => (
  <PageWrapper>
    <section className="pt-56 pb-48">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-8xl font-black mb-32 tracking-tighter leading-none">Tarifs.</h2>
        <div className="grid md:grid-cols-3 gap-10 items-stretch max-w-7xl mx-auto">
          {[
            { title: 'Self-Hosted', price: '0€', features: ['Assets illimités', 'Code complet', 'Community Support'] },
            { title: 'Cloud Pro', price: '29€', highlight: true, features: ['Manage Managed', 'Backups Auto', 'Support 24/7'] },
            { title: 'Enterprise', price: 'Custom', features: ['SLA Dédié', 'On-premise Air-gapped', 'Formation'] }
          ].map((plan, i) => (
            <div key={i} className={`bg-white/[0.03] border ${plan.highlight ? 'border-nebra-blue shadow-[0_0_80px_-20px_#007BFF44]' : 'border-white/10'} p-12 rounded-[50px] flex flex-col transform ${plan.highlight ? 'scale-105' : ''}`}>
              <h3 className="text-xl font-bold text-slate-400 mb-8">{plan.title}</h3>
              <div className="text-6xl font-black mb-12">{plan.price}</div>
              <ul className="space-y-6 flex-1 mb-16 text-left">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-4 text-slate-300 font-bold">
                    <CheckCircle2 className="h-5 w-5 text-network-teal" /> {f}
                  </li>
                ))}
              </ul>
              <button className={`w-full py-6 rounded-3xl font-black text-xl ${plan.highlight ? 'bg-nebra-blue' : 'bg-white/5 border border-white/10'}`}>
                {plan.highlight ? 'Essayer Gratuit' : 'GitHub'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  </PageWrapper>
)

const ContactPage = () => (
  <PageWrapper>
    <section className="pt-56 pb-48 min-h-screen">
      <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-24">
        <div>
          <h2 className="text-8xl font-black mb-10 tracking-tighter">Contact.</h2>
          <p className="text-2xl text-slate-400 font-medium mb-12 leading-relaxed">Une demande spécifique ? Notre équipe est prête à intervenir.</p>
          <div className="space-y-6">
            <div className="flex items-center gap-6 p-6 rounded-3xl bg-white/5 border border-white/10 group cursor-pointer hover:border-nebra-blue transition-all">
              <Mail className="h-7 w-7 text-slate-400 group-hover:text-nebra-blue" />
              <span className="text-xl font-bold text-white">contact@nebra.io</span>
            </div>
          </div>
        </div>
        <div className="bg-white/[0.03] border border-white/10 p-12 rounded-[3rem] backdrop-blur-3xl shadow-2xl">
          <form className="space-y-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Email Professionnel</label>
              <input type="email" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-nebra-blue outline-none transition-all" placeholder="john@company.com" />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Message</label>
              <textarea className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-nebra-blue outline-none transition-all min-h-[150px]" />
            </div>
            <button className="w-full py-6 rounded-2xl bg-nebra-blue text-white font-black text-xl shadow-2xl shadow-nebra-blue/20">
              ENVOYER LE SIGNAL
            </button>
          </form>
        </div>
      </div>
    </section>
  </PageWrapper>
)

// --- Main App ---

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#020205] text-white font-sans selection:bg-nebra-blue/30 overflow-x-hidden relative">
        <div className="noise fixed inset-0 opacity-[0.03] pointer-events-none z-[100]" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }} />
        
        <Navbar />

        <AnimatePresence mode="wait">
          <main className="relative z-10">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/features" element={<FeaturesPage />} />
              <Route path="/roadmap" element={<RoadmapPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/status" element={<StatusPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="*" element={<HomePage />} />
            </Routes>
          </main>
        </AnimatePresence>

        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
