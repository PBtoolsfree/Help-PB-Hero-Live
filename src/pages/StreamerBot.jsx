import React, { useState, useEffect, useRef } from 'react'
import { Activity, Radio, Database, ShieldAlert, CheckCircle2, XCircle, Clock } from 'lucide-react'
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui'
import axios from 'axios'

const API_URL = "/api"

export default function StreamerBotPage({ logs, config, onSave, backendStatus }) {
    const sbEvents = logs.filter(l => l.category === 'ALERT' || l.message.includes('Streamer.bot'))

    // Prioritize backendStatus if available, fallback to log sniffing
    const isConnected = backendStatus
        ? backendStatus.bot.streamer_bot_connected
        : (logs.some(l => l.message === 'Connected to Streamer.bot WS') &&
            !logs.find(l => l.message === 'Streamer.bot WS Disconnected. Retrying...' && l.timestamp > logs.find(l => l.message === 'Connected to Streamer.bot WS').timestamp))

    const sbConfig = config?.streamer_bot || {}
    const [host, setHost] = useState(sbConfig.host || '127.0.0.1')
    const [port, setPort] = useState(sbConfig.port || 8080)

    // Update local state when config changes elsewhere
    useEffect(() => {
        setHost(sbConfig.host || '127.0.0.1')
        setPort(sbConfig.port || 8080)
    }, [sbConfig.host, sbConfig.port])

    const handleToggle = () => {
        const newEnabled = !sbConfig.enabled
        const newConfig = {
            ...config,
            streamer_bot: {
                ...sbConfig,
                enabled: newEnabled,
                host: host,
                port: parseInt(port)
            }
        }
        onSave(newConfig)
    }

    const handleUpdate = () => {
        const newConfig = {
            ...config,
            streamer_bot: {
                ...sbConfig,
                host: host,
                port: parseInt(port)
            }
        }
        onSave(newConfig)
    }

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <div className="flex justify-between items-start">
                <div className="flex flex-col gap-4">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Streamer.bot Integration</h2>
                        <p className="text-muted-foreground text-sm">Manage your connection to Streamer.bot WebSockets.</p>
                    </div>

                    <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-4 rounded-xl shadow-inner">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Host IP</label>
                            <input
                                type="text"
                                value={host}
                                onChange={(e) => setHost(e.target.value)}
                                className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary w-40"
                                placeholder="127.0.0.1"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Port</label>
                            <input
                                type="number"
                                value={port}
                                onChange={(e) => setPort(e.target.value)}
                                className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary w-24"
                                placeholder="8080"
                            />
                        </div>
                        <div className="pt-5">
                            <button
                                onClick={handleUpdate}
                                className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg px-4 py-2 text-xs font-bold transition-all active:scale-95"
                            >
                                UPDATE
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-end gap-3">
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider ${isConnected ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>
                        {isConnected ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                        {isConnected ? 'Connected' : 'Disconnected'}
                    </div>

                    <button
                        onClick={handleToggle}
                        className={`px-6 py-2.5 rounded-xl font-black text-sm transition-all shadow-lg active:scale-95 ${sbConfig.enabled ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/20' : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/20'}`}
                    >
                        {sbConfig.enabled ? 'DISCONNECT' : 'CONNECT'}
                    </button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
                <StatBox title="Subscribers" value={sbEvents.filter(e => e.message.includes('NewSubscriber') || e.message.includes('NewSponsor')).length} icon={<Radio className="text-blue-500" />} />
                <StatBox title="Members" value={sbEvents.filter(e => e.message.includes('Member')).length} icon={<Database className="text-purple-500" />} />
                <StatBox title="Super Chats" value={sbEvents.filter(e => e.message.includes('SuperChat') || e.message.includes('SuperSticker')).length} icon={<Activity className="text-emerald-500" />} />
                <StatBox title="WS Alerts" value={sbEvents.filter(e => e.category === 'ALERT').length} icon={<ShieldAlert className="text-amber-500" />} />
            </div>

            <Card className="border-zinc-800 bg-black/40">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-primary" /> Live Event Stream
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="max-h-[500px] overflow-y-auto font-mono text-xs">
                        <table className="w-full text-left">
                            <thead className="bg-white/5 sticky top-0 border-b border-white/10 uppercase text-muted-foreground">
                                <tr>
                                    <th className="px-4 py-3">Time</th>
                                    <th className="px-4 py-3">Event</th>
                                    <th className="px-4 py-3">Details</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {sbEvents.length === 0 ? (
                                    <tr>
                                        <td colSpan="3" className="px-4 py-8 text-center text-muted-foreground italic">No events recorded yet. Ensure Streamer.bot is running with WebSockets enabled.</td>
                                    </tr>
                                ) : (
                                    [...sbEvents].reverse().map((e, idx) => (
                                        <tr key={idx} className="hover:bg-white/5 transition-colors">
                                            <td className="px-4 py-3 text-zinc-500">{new Date(e.timestamp * 1000).toLocaleTimeString()}</td>
                                            <td className="px-4 py-3 font-bold text-zinc-300">{e.category || 'EVENT'}</td>
                                            <td className="px-4 py-3 text-zinc-400">{e.message}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
                {/* HTTP Chat Section */}
                <Card className="border-zinc-800 bg-emerald-500/5 shadow-inner">
                    <CardHeader>
                        <CardTitle className="text-sm font-bold uppercase tracking-widest text-emerald-400 flex items-center gap-2">
                            <Radio className="h-4 w-4" /> HTTP Chat (New Option)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Incoming Endpoint</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    readOnly
                                    value={`http://${window.location.hostname}:${config?.server?.port || 8000}/chat`}
                                    className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono w-full text-emerald-300"
                                />
                                <button
                                    onClick={() => navigator.clipboard.writeText(`http://${window.location.hostname}:${config?.server?.port || 8000}/chat`)}
                                    className="bg-emerald-600 hover:bg-emerald-500 rounded-lg px-3 py-1 text-[10px] font-black uppercase"
                                >
                                    Copy
                                </button>
                            </div>
                        </div>
                        <p className="text-[10px] text-muted-foreground italic">
                            Copy this URL into your Streamer.bot "Fetch URL" or "C# Script" to send chat directly to the bot.
                        </p>
                    </CardContent>
                </Card>

                {/* Dashboard Port Section */}
                <Card className="border-zinc-800 bg-white/5">
                    <CardHeader>
                        <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">System Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-end gap-3">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Dashboard Port</label>
                                <input
                                    type="number"
                                    value={config?.server?.port || 8000}
                                    onChange={(e) => {
                                        const val = parseInt(e.target.value) || 8000
                                        onSave({
                                            ...config,
                                            server: {
                                                ...config.server,
                                                port: val
                                            }
                                        })
                                    }}
                                    className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm font-mono w-24 focus:outline-none focus:ring-1 focus:ring-primary"
                                />
                            </div>
                            <div className="text-[10px] text-rose-400/80 max-w-[150px] leading-tight mb-2">
                                ⚠️ Changing this will restart the server.
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Test Controls Section */}
            <Card className="border-zinc-800 bg-white/5 border-dashed">
                <CardHeader>
                    <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                        <Activity className="h-4 w-4" /> Manual Test Controls
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-4">
                        <TestButton
                            label="Test Subscriber"
                            color="bg-emerald-600 hover:bg-emerald-500"
                            onClick={() => axios.post(API_URL + '/test/alert', { type: 'NewSubscriber', author: 'Test User' })}
                        />
                        <TestButton
                            label="Test Super Chat"
                            color="bg-amber-600 hover:bg-amber-500"
                            onClick={() => axios.post(API_URL + '/test/alert', { type: 'SuperChat', author: 'Rich User', message: 'Take my money!' })}
                        />
                        <TestButton
                            label="Test Member"
                            color="bg-purple-600 hover:bg-purple-500"
                            onClick={() => axios.post(API_URL + '/test/alert', { type: 'Member', author: 'Loyal Fan' })}
                        />
                        <TestButton
                            label="Test Chat Message"
                            color="bg-blue-600 hover:bg-blue-500"
                            onClick={() => axios.post(API_URL + '/sb/chat', { user: 'Chatter', message: 'Hello bot! This is a test.' })}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

function TestButton({ label, color, onClick }) {
    const [loading, setLoading] = useState(false)
    const handleClick = async () => {
        setLoading(true)
        try {
            await onClick()
        } catch (err) {
            console.error(err)
        }
        setTimeout(() => setLoading(false), 500)
    }
    return (
        <button
            onClick={handleClick}
            disabled={loading}
            className={`${color} text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider shadow-lg active:scale-95 disabled:opacity-50 transition-all`}
        >
            {loading ? 'Sending...' : label}
        </button>
    )
}

function StatBox({ title, value, icon }) {
    return (
        <Card className="border-zinc-800 bg-zinc-900/40 shadow-sm transition-all hover:border-white/10">
            <CardContent className="p-4 flex items-center justify-between">
                <div>
                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{title}</div>
                    <div className="text-2xl font-black mt-0.5">{value}</div>
                </div>
                <div className="h-10 w-10 rounded-lg bg-white/5 flex items-center justify-center">
                    {icon}
                </div>
            </CardContent>
        </Card>
    )
}
