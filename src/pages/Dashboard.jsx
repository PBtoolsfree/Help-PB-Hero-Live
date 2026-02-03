import React from 'react'
import axios from 'axios'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import { Terminal, Shield, MessageSquare, Zap, Activity, AlertCircle } from 'lucide-react'

export default function Dashboard({ logs }) {
    const modActions = logs.filter(l => l.category === 'MOD').length
    const chatCount = logs.filter(l => l.category === 'CHAT').length
    const aiCount = logs.filter(l => l.category === 'AI_RESPONSE').length

    return (
        <div className="space-y-6 h-full flex flex-col antialiased">
            <div className="grid gap-4 md:grid-cols-4">
                <StatCard
                    title="Uptime"
                    value="00:12:30"
                    icon={<Activity className="h-4 w-4 text-zinc-500" />}
                />
                <StatCard
                    title="Live Traffic"
                    value={chatCount}
                    icon={<MessageSquare className="h-4 w-4 text-blue-500" />}
                />
                <StatCard
                    title="MOD Interventions"
                    value={modActions}
                    color="text-rose-500"
                    icon={<Shield className="h-4 w-4 text-rose-500" />}
                />
                <Card className="relative overflow-hidden group border-emerald-500/20 bg-emerald-500/5 shadow-lg shadow-emerald-900/10">
                    <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500 animate-pulse" />
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div className="text-xs font-black text-emerald-400 uppercase tracking-widest flex items-center gap-1">
                                <Shield className="h-4 w-4" /> Shield Status
                            </div>
                            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                        </div>
                        <div className={`text-3xl font-black mt-2 text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.3)] tracking-tighter`}>VIGILANT</div>
                    </CardContent>
                </Card>
            </div>

            <AudioStats />

            <Card className="flex-1 flex flex-col overflow-hidden border-zinc-800 bg-black/60 backdrop-blur-md shadow-2xl rounded-xl">
                <CardHeader className="py-4 border-b border-white/5 bg-zinc-900/40">
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-base font-black flex items-center gap-2 tracking-widest text-zinc-300">
                            <Terminal className="h-5 w-5 text-emerald-500" /> SYSTEM MANIFEST
                        </CardTitle>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                                <span className="text-xs font-bold text-zinc-400 uppercase">Chat</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                                <span className="text-xs font-bold text-zinc-400 uppercase">Mod</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                                <span className="text-xs font-bold text-zinc-400 uppercase">AI Response</span>
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto p-0 font-mono text-sm">
                    {logs.length === 0 ? (
                        <div className="p-12 text-muted-foreground opacity-30 text-center flex flex-col items-center gap-4">
                            <Activity className="h-12 w-12 animate-pulse" />
                            <span className="uppercase tracking-[0.2em] font-black">Establishing Neural Link...</span>
                        </div>
                    ) : (
                        <div className="flex flex-col">
                            {logs.map((log, i) => (
                                <div key={i} className={`flex gap-4 items-center px-6 py-3 border-b border-white/[0.03] last:border-0 hover:bg-white/[0.04] transition-colors
                                ${log.category === 'MOD' ? 'bg-rose-500/[0.05]' : ''}`}>
                                    <span className="text-xs font-bold text-zinc-400 w-20 tabular-nums">{new Date(log.timestamp * 1000).toLocaleTimeString([], { hour12: false })}</span>

                                    <div className={`flex items-center gap-2 px-3 py-1 rounded text-xs font-black uppercase tracking-tighter min-w-[100px] justify-center border
                                    ${log.category === 'CHAT' ? 'bg-blue-500/10 text-blue-300 border-blue-500/30' :
                                            log.category === 'AI_RESPONSE' ? 'bg-purple-500/10 text-purple-300 border-purple-500/30' :
                                                log.category === 'MOD' ? 'bg-rose-500/10 text-rose-300 border-rose-500/30' :
                                                    log.category === 'ERROR' ? 'bg-red-500/20 text-red-300 border-red-500/40' :
                                                        'bg-zinc-800 text-zinc-300 border-zinc-600'}`}>
                                        {log.category === 'MOD' && <Shield className="h-3 w-3" />}
                                        {log.category === 'AI_RESPONSE' && <Zap className="h-3 w-3" />}
                                        {log.category === 'ERROR' && <AlertCircle className="h-3 w-3" />}
                                        {log.category}
                                    </div>

                                    <span className="flex-1 text-zinc-300 overflow-hidden whitespace-nowrap overflow-ellipsis">
                                        {log.author && <span className="font-bold text-white mr-2 text-xs"><span className="text-zinc-500 opacity-70">@</span>{log.author}</span>}
                                        <span className={log.category === 'MOD' ? 'text-rose-300 font-bold' : ''}>
                                            {log.message}
                                        </span>
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

function AudioStats() {
    const [stats, setStats] = React.useState(null)

    React.useEffect(() => {
        const interval = setInterval(async () => {
            try {
                const res = await axios.get('/api/audio/status')
                setStats(res.data)
            } catch (e) { }
        }, 2000)
        return () => clearInterval(interval)
    }, [])

    if (!stats) return null

    return (
        <div className="grid gap-4 md:grid-cols-4">
            <Card className="bg-zinc-950/40 border-zinc-800/50 p-5 shadow-xl">
                <div className="text-xs font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2 mb-2">
                    <div className="h-2 w-2 rounded-full bg-emerald-500" /> Buffers Active
                </div>
                <div className="text-3xl font-black text-white">{stats.queues.public} <span className="text-sm text-zinc-500">PUB</span> / {stats.queues.secret} <span className="text-sm text-zinc-500">SEC</span></div>
            </Card>
            <Card className="bg-zinc-950/40 border-zinc-800/50 p-5 shadow-xl">
                <div className="text-xs font-black text-rose-500 uppercase tracking-widest flex items-center gap-2 mb-2">
                    <Activity className="h-4 w-4" /> Packet Loss
                </div>
                <div className={`text-3xl font-black ${stats.metrics.dropped_count > 0 ? 'text-rose-500' : 'text-zinc-300'}`}>{stats.metrics.dropped_count} <span className="text-sm opacity-60 font-medium">dropped</span></div>
            </Card>
            <Card className="bg-zinc-950/40 border-zinc-800/50 p-5 shadow-xl">
                <div className="text-xs font-black text-amber-500 uppercase tracking-widest flex items-center gap-2 mb-2">
                    <Zap className="h-4 w-4" /> Neural Latency
                </div>
                <div className="text-3xl font-black text-white">{stats.metrics.avg_latency ? stats.metrics.avg_latency.toFixed(2) : 0}ms</div>
            </Card>
            <Card className="bg-zinc-950/40 border-zinc-800/50 p-5 shadow-xl">
                <div className="text-xs font-black text-blue-500 uppercase tracking-widest flex items-center gap-2 mb-2">
                    <MessageSquare className="h-4 w-4" /> Voice Cycles
                </div>
                <div className="text-3xl font-black text-white">{stats.metrics.played_count}</div>
            </Card>
        </div>
    )
}

function StatCard({ title, value, color, icon }) {
    return (
        <Card className="bg-zinc-950/40 border-white/[0.03] shadow-xl group hover:border-white/10 transition-colors">
            <CardContent className="p-6">
                <div className="flex justify-between items-start">
                    <div className="text-xs font-black text-zinc-400 uppercase tracking-widest">{title}</div>
                    {icon}
                </div>
                <div className={`text-3xl font-black mt-2 tracking-tighter ${color || 'text-white'}`}>{value}</div>
            </CardContent>
        </Card>
    )
}

