import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Heart, Calendar, ArrowUpRight, Award, UserPlus, Clock } from 'lucide-react'
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui'

export default function LoyaltyPage() {
    const [viewers, setViewers] = useState({})

    useEffect(() => {
        const fetchViewers = async () => {
            try {
                const res = await axios.get('/api/viewers')
                setViewers(res.data)
            } catch (e) {
                console.error("Viewers fetch error", e)
            }
        }
        fetchViewers()
        const interval = setInterval(fetchViewers, 10000)
        return () => clearInterval(interval)
    }, [])

    const viewerList = Object.entries(viewers).map(([name, data]) => ({ name, ...data }))

    // Stats
    const totalViewers = viewerList.length
    const returningToday = viewerList.filter(v => v.last_date === new Date().toISOString().split('T')[0]).length
    const streaks = viewerList.filter(v => v.consecutive_days >= 2).length

    const sortedStreaks = [...viewerList].sort((a, b) => (b.consecutive_days || 0) - (a.consecutive_days || 0)).slice(0, 10)

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Loyalty & Retention</h2>
                    <p className="text-muted-foreground">Tracking the legends who keep coming back.</p>
                </div>
                <div className="flex items-center gap-2 bg-pink-500/10 text-pink-400 px-3 py-1.5 rounded-full border border-pink-500/20 text-xs font-bold uppercase tracking-wider">
                    <Heart className="h-3 w-3 fill-current" />
                    Viewer Love
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <StatBox title="Active Today" value={returningToday} icon={<UserPlus className="text-emerald-500" />} />
                <StatBox title="On a Streak" value={streaks} icon={<ArrowUpRight className="text-blue-500" />} />
                <StatBox title="Total Legends" value={totalViewers} icon={<Award className="text-amber-500" />} />
            </div>

            <Card className="border-zinc-800 bg-black/40">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-primary" /> Multi-Day Streaks
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs uppercase bg-white/5 text-muted-foreground border-b border-white/10">
                                <tr>
                                    <th className="px-6 py-3">Viewer</th>
                                    <th className="px-6 py-3 text-center">Consecutive Days</th>
                                    <th className="px-6 py-3 text-center">Last Visit</th>
                                    <th className="px-6 py-3 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {sortedStreaks.map((v) => (
                                    <tr key={v.name} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 font-bold text-zinc-100">{v.name}</td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="inline-flex items-center gap-1 bg-blue-500/10 text-blue-400 px-2 py-1 rounded-md border border-blue-500/20 font-mono">
                                                {v.consecutive_days || 1} 🔥
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center text-zinc-400 font-mono">
                                            {v.last_date || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {v.consecutive_days >= 2 ? (
                                                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30 uppercase font-black">LOYAL</span>
                                            ) : (
                                                <span className="text-[10px] bg-zinc-800 text-zinc-500 px-2 py-0.5 rounded-full uppercase font-black">EXPLORER</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-zinc-800 bg-white/5">
                <CardHeader>
                    <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Announcement Triggers</CardTitle>
                </CardHeader>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="p-4 rounded-lg bg-black/40 border border-white/5">
                        <div className="flex items-center gap-2 font-bold text-zinc-200 mb-1">
                            <div className="h-2 w-2 rounded-full bg-blue-500" />
                            Return Streak (2 Days)
                        </div>
                        <p className="text-xs text-muted-foreground italic leading-relaxed">
                            Plays a Hindi greeting for consecutive daily returns.
                        </p>
                    </div>
                    <div className="p-4 rounded-lg bg-black/40 border border-white/5">
                        <div className="flex items-center gap-2 font-bold text-zinc-200 mb-1">
                            <div className="h-2 w-2 rounded-full bg-emerald-500" />
                            Weekly Legend (7 Days)
                        </div>
                        <p className="text-xs text-muted-foreground italic leading-relaxed">
                            Special Hindi announcement celebrating 1 week of loyalty.
                        </p>
                    </div>
                    <div className="p-4 rounded-lg bg-black/40 border border-white/5">
                        <div className="flex items-center gap-2 font-bold text-zinc-200 mb-1">
                            <div className="h-2 w-2 rounded-full bg-purple-500" />
                            Monthly God (30 Days)
                        </div>
                        <p className="text-xs text-muted-foreground italic leading-relaxed">
                            Major celebration for 1 month of consecutive participation!
                        </p>
                    </div>
                    <div className="p-4 rounded-lg bg-black/40 border border-white/5">
                        <div className="flex items-center gap-2 font-bold text-zinc-200 mb-1">
                            <div className="h-2 w-2 rounded-full bg-amber-500" />
                            Return from Break (3+ Days)
                        </div>
                        <p className="text-xs text-muted-foreground italic leading-relaxed">
                            Plays a "Missed You" Hindi announcement after a long absence.
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    )
}

function StatBox({ title, value, icon }) {
    return (
        <Card className="border-zinc-800 bg-zinc-900/40">
            <CardContent className="p-6 flex items-center justify-between">
                <div>
                    <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{title}</div>
                    <div className="text-3xl font-black mt-1">{value}</div>
                </div>
                <div className="h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/5">
                    {icon}
                </div>
            </CardContent>
        </Card>
    )
}
