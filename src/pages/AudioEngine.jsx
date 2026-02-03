import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Volume2, Zap, Clock, ThumbsUp, Activity } from 'lucide-react'
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui'

export default function AudioEnginePage() {
    const [stats, setStats] = useState(null)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get('/api/audio/status')
                setStats(res.data)
            } catch (e) {
                console.error("Audio stats fetch error", e)
            }
        }
        fetchStats()
        const interval = setInterval(fetchStats, 2000)
        return () => clearInterval(interval)
    }, [])

    if (!stats) return <div className="p-8 text-center text-muted-foreground">Loading Engine Stats...</div>

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Audio Engine</h2>
                    <p className="text-muted-foreground">Real-time performance metrics and TTS optimization.</p>
                </div>
                <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-full border border-emerald-500/20 text-xs font-bold uppercase tracking-wider">
                    <Activity className="h-3 w-3" />
                    System Healthy
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <MetricCard
                    title="Average Latency"
                    value={`${stats.metrics.avg_latency?.toFixed(2) || 0}s`}
                    icon={<Clock className="text-amber-500" />}
                    desc="Generation + Transport time"
                />
                <MetricCard
                    title="Total Messages"
                    value={stats.metrics.played_count}
                    icon={<Volume2 className="text-blue-500" />}
                    desc="Cumulative phrases spoken"
                />
                <MetricCard
                    title="Dropped Phrases"
                    value={stats.metrics.dropped_count}
                    icon={<Zap className="text-rose-500" />}
                    desc="Queue overflows / errors"
                />
            </div>

            <Card className="border-zinc-800 bg-black/40">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <Activity className="h-5 w-5 text-primary" /> Performance Analysis
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="p-4 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                                <ThumbsUp className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <div className="font-bold text-zinc-100">Prabhat Neural (en-IN)</div>
                                <div className="text-xs text-muted-foreground font-mono uppercase">Optimized for Stream Clarity</div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-primary font-bold">Text-to-speech FREE</div>
                            <div className="text-[10px] text-muted-foreground uppercase tracking-widest">Powered by Edge-TTS</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2 p-4 rounded-lg bg-zinc-900/50">
                            <div className="text-xs text-muted-foreground uppercase font-bold">Queue Backlog</div>
                            <div className="flex items-end gap-2">
                                <div className="text-2xl font-mono font-bold">{stats.queues.public + stats.queues.secret}</div>
                                <div className="text-xs text-zinc-500 mb-1">items pending</div>
                            </div>
                        </div>
                        <div className="space-y-2 p-4 rounded-lg bg-zinc-900/50">
                            <div className="text-xs text-muted-foreground uppercase font-bold">Voice Status</div>
                            <div className="flex items-center gap-2">
                                <div className={`h-2 w-2 rounded-full ${stats.is_playing ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-600'}`} />
                                <div className="text-lg font-bold">{stats.is_playing ? 'Speaking...' : 'Idle'}</div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-zinc-800 bg-black/20">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-muted-foreground uppercase tracking-widest">Last Generated Text</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="p-4 rounded-lg bg-black border border-white/5 font-mono text-sm text-zinc-300 italic">
                        "{stats.current_text || "Waiting for audio event..."}"
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

function MetricCard({ title, value, icon, desc }) {
    return (
        <Card className="border-zinc-800 bg-zinc-900/50">
            <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                    <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{title}</div>
                    <div className="p-2 rounded-lg bg-white/5">{icon}</div>
                </div>
                <div className="text-3xl font-bold font-mono tracking-tighter">{value}</div>
                <p className="text-[10px] text-zinc-500 mt-2 uppercase font-medium">{desc}</p>
            </CardContent>
        </Card>
    )
}
