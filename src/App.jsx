import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { LayoutDashboard, Settings, Cpu, Activity, Power, LogOut, Monitor, Shield, Users, ShieldBan, Volume2, Heart, Share2, Beaker, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import Dashboard from './pages/Dashboard'
import Orchestrator from './pages/Orchestrator'
import AudioOverlay from './pages/AudioOverlay'
import OBSPage from './pages/OBS'
import ModerationPage from './pages/Moderation'
import ViewersPage from './pages/Viewers'
import AudioEnginePage from './pages/AudioEngine'
import LoyaltyPage from './pages/Loyalty'
import PersonalitiesPage from './pages/Personalities'
import ChatOverlay from './pages/ChatOverlay'
import AlertOverlay from './pages/AlertOverlay'
import StreamerBotPage from './pages/StreamerBot'
import TestingPage from './pages/Testing'
import SettingsPage from './pages/Settings'
import IgnoreListPage from './pages/IgnoreList'
import UPIControl from './pages/UPIControl'
import PaymentPage from './pages/PaymentPage'

const API_URL = "/api"

function App() {
  const isOverlay = window.location.search.includes('mode=overlay')
  const isChatOverlay = window.location.search.includes('mode=chat')
  const isAlertOverlay = window.location.search.includes('mode=alert')

  const [activeTab, setActiveTab] = useState('dashboard')
  const [config, setConfig] = useState(null)
  const [logs, setLogs] = useState([])
  const [backendStatus, setBackendStatus] = useState(null)
  const [status, setStatus] = useState('disconnected')
  const [error, setError] = useState(null)
  const wsRef = useRef(null)

  useEffect(() => {
    fetchConfig()
    fetchStatus()
    connectWebSocket()
    const interval = setInterval(fetchStatus, 5000)
    return () => {
      if (wsRef.current) wsRef.current.close()
      clearInterval(interval)
    }
  }, [])

  const fetchStatus = async () => {
    try {
      const res = await axios.get(`${API_URL}/status`)
      setBackendStatus(res.data)
    } catch (e) {
      console.error("Status Load Error", e)
    }
  }

  const fetchConfig = async () => {
    try {
      setError(null)
      const res = await axios.get(`${API_URL}/config`)
      if (res.data && typeof res.data === 'object' && res.data.youtube) {
        setConfig(res.data)
      } else {
        console.error("Invalid Config:", res.data)
        throw new Error("Invalid configuration received (Not JSON)")
      }
    } catch (e) {
      console.error("Config Load Error", e)
      setError(e.message)
    }
  }

  const connectWebSocket = () => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const ws = new WebSocket(`${protocol}//${window.location.host}/ws/logs`)
    ws.onopen = () => setStatus('connected')
    ws.onclose = () => {
      setStatus('disconnected')
      setTimeout(connectWebSocket, 3000)
    }
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      setLogs(prev => [data, ...prev].slice(0, 50))
    }
    wsRef.current = ws
  }

  const handleSaveConfig = async (newConfig) => {
    try {
      await axios.post(`${API_URL}/config`, { config: newConfig })
      setConfig(newConfig)
      alert("Configuration Saved!")
    } catch (e) {
      alert("Save Failed: " + e.message)
    }
  }

  if (window.location.search.includes('mode=pay')) return <PaymentPage />

  // Safety check for config integrity
  const isValidConfig = config && typeof config === 'object' && config.youtube;

  if (!isValidConfig) return (
    <div className="flex flex-col h-screen items-center justify-center bg-zinc-950 text-white gap-4">
      {error ? (
        <>
          <div className="text-rose-500 font-bold text-xl">Connection Error</div>
          <div className="text-zinc-400 font-mono text-sm bg-zinc-900 p-4 rounded-lg border border-white/5 max-w-lg overflow-auto">
            {typeof error === 'string' ? error : JSON.stringify(error)}
          </div>
          <button onClick={fetchConfig} className="px-4 py-2 bg-primary rounded-lg text-sm font-bold hover:bg-blue-600 transition-colors">Retry Connection</button>
        </>
      ) : (
        <>
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
          <div className="text-zinc-500 animate-pulse uppercase tracking-widest text-xs font-bold">Initializing Pi Bot v2...</div>
        </>
      )}
    </div>
  )



  if (isOverlay) return <div className="bg-transparent h-screen w-screen"><AudioOverlay /></div>
  if (isChatOverlay) return <div className="bg-transparent h-screen w-screen"><ChatOverlay /></div>
  if (isAlertOverlay) return <div className="bg-transparent h-screen w-screen"><AlertOverlay /></div>

  return (
    <div className="flex h-screen bg-background text-foreground font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-16 md:w-64 border-r border-sidebar-accent bg-sidebar text-sidebar-foreground flex flex-col transition-all duration-300">
        <div className="h-16 flex items-center justify-center md:justify-start md:px-6 border-b border-sidebar-accent bg-sidebar-accent/50 shrink-0">
          <div className="font-bold text-xl tracking-tight hidden md:block text-white">Pi Bot <span className="text-primary">v2</span></div>
          <div className="font-bold text-xl tracking-tight md:hidden text-white">Pi</div>
        </div>

        <div className="flex-1 overflow-y-auto py-2">
          <nav className="p-4 space-y-2">
            <NavItem id="dashboard" icon={<Activity />} label="Dashboard" active={activeTab} onClick={setActiveTab} />
            <NavItem id="personalities" icon={<Sparkles />} label="Personalities" active={activeTab} onClick={setActiveTab} />
            <NavItem id="orchestrator" icon={<Cpu />} label="Orchestrator" active={activeTab} onClick={setActiveTab} />
            <NavItem id="moderation" icon={<Shield />} label="Moderation" active={activeTab} onClick={setActiveTab} />
            <NavItem id="ignore_list" icon={<ShieldBan />} label="Ignore List" active={activeTab} onClick={setActiveTab} />
            <NavItem id="viewers" icon={<Users />} label="Audience" active={activeTab} onClick={setActiveTab} />
            <NavItem id="loyalty" icon={<Heart />} label="Loyalty" active={activeTab} onClick={setActiveTab} />
            <NavItem id="streamer_bot" icon={<Share2 />} label="Integrations" active={activeTab} onClick={setActiveTab} />
            <NavItem id="upi" icon={<DollarSign />} label="Monetization" active={activeTab} onClick={setActiveTab} />
            <NavItem id="audio_engine" icon={<Volume2 />} label="Audio Engine" active={activeTab} onClick={setActiveTab} />
            <NavItem id="obs" icon={<Monitor />} label="OBS Source" active={activeTab} onClick={setActiveTab} />
            <NavItem id="testing" icon={<Beaker />} label="Testing" active={activeTab} onClick={setActiveTab} />
            <NavItem id="settings" icon={<Settings />} label="Settings" active={activeTab} onClick={() => setActiveTab('settings')} />
          </nav>
        </div>

        <div className="p-4 border-t border-sidebar-accent bg-sidebar-accent/30 shrink-0">
          <div className="flex items-center gap-3 text-sm text-sidebar-foreground/90 justify-center md:justify-start">
            <div className={`w-2.5 h-2.5 rounded-full shadow-sm ${status === 'connected' ? 'bg-emerald-500 shadow-emerald-500/50' : 'bg-rose-500 shadow-rose-500/50'}`} />
            <span className="hidden md:inline font-medium">{status === 'connected' ? 'System Online' : 'Disconnected'}</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden bg-background">
        <header className="h-16 border-b flex items-center px-8 justify-between bg-white shadow-sm z-10">
          <h1 className="font-bold text-2xl capitalize text-gray-800 tracking-tight">{activeTab}</h1>
          <div className="flex items-center gap-4">
            <div className="text-sm font-medium text-muted-foreground bg-muted px-3 py-1.5 rounded-full border">
              Video ID: <span className="text-foreground">{config?.youtube?.video_id || "Not Configured"}</span>
            </div>
            <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
              PI
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {activeTab === 'dashboard' && <Dashboard logs={logs} />}
            {activeTab === 'orchestrator' && <Orchestrator config={config} onSave={handleSaveConfig} />}
            {activeTab === 'moderation' && <ModerationPage config={config} onSave={handleSaveConfig} />}
            {activeTab === 'viewers' && <ViewersPage />}
            {activeTab === 'loyalty' && <LoyaltyPage />}
            {activeTab === 'personalities' && <PersonalitiesPage config={config} onSave={handleSaveConfig} />}
            {activeTab === 'streamer_bot' && <StreamerBotPage logs={logs} config={config} onSave={handleSaveConfig} backendStatus={backendStatus} />}
            {activeTab === 'upi' && <UPIControl config={config} onSave={handleSaveConfig} />}
            {activeTab === 'ignore_list' && <IgnoreListPage config={config} onSave={handleSaveConfig} />}
            {activeTab === 'audio_engine' && <AudioEnginePage />}
            {activeTab === 'obs' && <OBSPage config={config} onSave={handleSaveConfig} />}
            {activeTab === 'testing' && <TestingPage />}
            {activeTab === 'settings' && <SettingsPage config={config} onSave={handleSaveConfig} />}
          </div>
        </div>
      </main>
    </div>
  )
}

function NavItem({ id, icon, label, active, onClick }) {
  return (
    <button
      onClick={() => onClick(id)}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
        active === id
          ? "bg-primary text-white shadow-md shadow-blue-900/20"
          : "text-sidebar-foreground/90 hover:bg-sidebar-accent hover:text-white"
      )}
    >
      {React.cloneElement(icon, { className: "h-5 w-5" })}
      <span className="hidden md:inline">{label}</span>
    </button>
  )
}

export default App
