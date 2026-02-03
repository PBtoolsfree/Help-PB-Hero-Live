import React, { useState } from 'react'
import axios from 'axios'
import { Beaker, MessageSquare, Mic, Send, Trash2, CheckCircle, XCircle, Activity, ShieldCheck, Zap } from 'lucide-react'
import { Card, CardHeader, CardContent, CardTitle, Input, Button, Label } from '@/components/ui'

export default function TestingPage() {
    const [aiPrompt, setAiPrompt] = useState('')
    const [ttsText, setTtsText] = useState('')
    const [responses, setResponses] = useState([])
    const [loading, setLoading] = useState(false)
    const [systemStatus, setSystemStatus] = useState(null)

    const handleSystemCheck = async () => {
        try {
            const res = await axios.post('/api/test/system')
            setSystemStatus(res.data)
            setResponses(prev => [
                { type: 'SYSTEM', text: `Diagnostics Complete: All systems operational.`, time: new Date().toLocaleTimeString() },
                ...prev
            ])
        } catch (err) {
            setResponses(prev => [
                { type: 'ERROR', text: `System Check Failed: ${err.message}`, time: new Date().toLocaleTimeString() },
                ...prev
            ])
        }
    }

    const handleSendTestChat = async () => {
        try {
            const res = await axios.post('/api/test/send_chat')
            setResponses(prev => [
                { type: 'CHAT', text: `Test Message Sent: "${res.data.message}"`, time: new Date().toLocaleTimeString() },
                ...prev
            ])
        } catch (err) {
            setResponses(prev => [
                { type: 'ERROR', text: `Chat Test Failed: ${err.message}`, time: new Date().toLocaleTimeString() },
                ...prev
            ])
        }
    }

    const handleAiTest = async (e) => {
        e.preventDefault()
        if (!aiPrompt.trim()) return

        setLoading(true)
        const timestamp = new Date().toLocaleTimeString()
        try {
            const res = await axios.post('/api/chat', { prompt: aiPrompt })
            setResponses(prev => [
                { type: 'AI', prompt: aiPrompt, text: res.data.response, time: timestamp },
                ...prev
            ])
            setAiPrompt('')
        } catch (err) {
            setResponses(prev => [
                { type: 'ERROR', text: `AI Error: ${err.message}`, time: timestamp },
                ...prev
            ])
        } finally {
            setLoading(false)
        }
    }

    const handleTtsTest = async (channel) => {
        if (!ttsText.trim()) return

        try {
            console.log("TTS Test Start:", channel, ttsText);
            await axios.post('/api/audio/speak', { text: ttsText, channel })
            console.log("TTS Test Success");
            setResponses(prev => [
                { type: 'TTS', text: `Sent to ${channel}: "${ttsText}"`, time: new Date().toLocaleTimeString() },
                ...prev
            ])
            setTtsText('')
        } catch (err) {
            console.error("TTS Test Error:", err);
            setResponses(prev => [
                { type: 'ERROR', text: `TTS Error: ${err.message}`, time: new Date().toLocaleTimeString() },
                ...prev
            ])
        }
    }

    const triggerAlert = async (type) => {
        try {
            const res = await axios.post('/api/test/alert', { type, author: "Pi Bot Tester" })
            setResponses(prev => [
                { type: 'SIMULATION', text: `Simulated ${type} alert triggered.`, time: new Date().toLocaleTimeString() },
                ...prev
            ])
        } catch (err) {
            setResponses(prev => [
                { type: 'ERROR', text: `Alert Error: ${err.message}`, time: new Date().toLocaleTimeString() },
                ...prev
            ])
        }
    }

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                        Advanced Testing <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full uppercase">v3.0 - Debug</span>
                    </h2>
                    <p className="text-zinc-400">Manually trigger AI responses and text-to-speech engine.</p>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    className="border-zinc-800 text-zinc-400 hover:text-white"
                    onClick={() => setResponses([])}
                >
                    <Trash2 className="h-4 w-4 mr-2" /> Clear History
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* System Integrity Check - NEW */}
                <Card className="border-emerald-500/30 bg-emerald-950/20 backdrop-blur-xl md:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-emerald-400">
                            <ShieldCheck className="h-5 w-5" /> System Integrity Check
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex gap-4">
                            <Button onClick={handleSystemCheck} className="bg-emerald-600 hover:bg-emerald-500 text-white">
                                <Activity className="h-4 w-4 mr-2" /> Run Diagnostics
                            </Button>
                            <Button onClick={handleSendTestChat} variant="secondary" className="bg-blue-600/20 text-blue-400 hover:bg-blue-600/40 border border-blue-500/30">
                                <Zap className="h-4 w-4 mr-2" /> Send Test Chat to Live Stream
                            </Button>
                        </div>

                        {systemStatus && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <StatusBadge
                                    label="OBS / Streamer.bot"
                                    status={systemStatus.streamer_bot.status}
                                    meta={systemStatus.streamer_bot.meta}
                                />
                                <StatusBadge
                                    label="YouTube Chat"
                                    status={systemStatus.youtube.status}
                                    meta={systemStatus.youtube.meta}
                                />
                                <StatusBadge
                                    label="Audio Engine"
                                    status={systemStatus.audio.status}
                                    meta={systemStatus.audio.meta}
                                />
                                <StatusBadge
                                    label="Viewer Tracking"
                                    status={systemStatus.viewers.status}
                                    meta={systemStatus.viewers.meta}
                                />
                            </div>
                        )}
                        <p className="text-[10px] text-zinc-500 uppercase tracking-widest">
                            Verifies that OBS, YouTube, and Audio pipelines are fully connected and ready for live broadcasting.
                        </p>
                    </CardContent>
                </Card>

                {/* AI Chat Testing */}
                <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur-xl">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-primary">
                            <MessageSquare className="h-5 w-5" /> AI Engine Test
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleAiTest} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="ai-prompt">Simulate Viewer Prompt</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="ai-prompt"
                                        placeholder="Type something to ask AI..."
                                        value={aiPrompt}
                                        onChange={(e) => setAiPrompt(e.target.value)}
                                        className="bg-black/50 border-zinc-800 text-white"
                                    />
                                    <Button type="submit" disabled={loading || !aiPrompt.trim()}>
                                        {loading ? <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" /> : <Send className="h-4 w-4" />}
                                    </Button>
                                </div>
                            </div>
                            <p className="text-[10px] text-zinc-500 uppercase tracking-widest">
                                This will use your configured AI Strategy and Providers.
                            </p>
                        </form>
                    </CardContent>
                </Card>

                {/* TTS Testing */}
                <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur-xl">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-emerald-400">
                            <Mic className="h-5 w-5" /> TTS Engine Test
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="tts-text">Voice Synthesis Text</Label>
                            <Input
                                id="tts-text"
                                placeholder="Type text to speak..."
                                value={ttsText}
                                onChange={(e) => setTtsText(e.target.value)}
                                className="bg-black/50 border-zinc-800 text-white"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <Button variant="secondary" onClick={() => handleTtsTest('public')} disabled={!ttsText.trim()}>
                                <Mic className="h-4 w-4 mr-2" /> Public Chat
                            </Button>
                            <Button variant="outline" className="border-zinc-700" onClick={() => handleTtsTest('secret')} disabled={!ttsText.trim()}>
                                <Beaker className="h-4 w-4 mr-2" /> Secret (Head)
                            </Button>
                        </div>
                        <p className="text-[10px] text-zinc-500 uppercase tracking-widest">
                            Public plays on stream. Secret plays on your headphones only.
                        </p>
                    </CardContent>
                </Card>

                {/* OBS Alert Testing */}
                <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur-xl md:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-primary">
                            <Beaker className="h-5 w-5" /> OBS Alert Simulation
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                            <AlertButton label="New Subscriber" type="NewSubscriber" emoji="❤️" onClick={(t) => triggerAlert(t)} />
                            <AlertButton label="New Member" type="Member" emoji="💎" onClick={(t) => triggerAlert(t)} />
                            <AlertButton label="Super Chat" type="SuperChat" emoji="⭐" onClick={(t) => triggerAlert(t)} />
                            <AlertButton label="Gift Sub" type="GiftSub" emoji="🎁" onClick={(t) => triggerAlert(t)} />
                            <AlertButton label="Rank Up" type="RANK_UP" emoji="👑" onClick={(t) => triggerAlert(t)} />
                            <AlertButton label="Loyalty" type="LOYALTY" emoji="💖" onClick={(t) => triggerAlert(t)} />
                        </div>
                        <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-4">
                            These will trigger visual alerts in the OBS Overlay and play a simulation announcement.
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Test Results / History */}
            <Card className="border-zinc-800 bg-black/40">
                <CardHeader className="pb-2 border-b border-zinc-800/50">
                    <CardTitle className="text-sm font-bold text-zinc-500 uppercase tracking-tighter">Test Execution History</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="divide-y divide-zinc-800/50">
                        {responses.length === 0 ? (
                            <div className="p-8 text-center text-zinc-600 italic">No tests executed in this session.</div>
                        ) : (
                            responses.map((res, i) => (
                                <div key={i} className="p-4 space-y-2 hover:bg-white/5 transition-colors">
                                    <div className="flex justify-between items-center">
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${res.type === 'AI' ? 'bg-primary/20 text-primary' :
                                            res.type === 'ERROR' ? 'bg-rose-500/20 text-rose-400' : 'bg-zinc-800 text-zinc-400'
                                            }`}>
                                            {res.type}
                                        </span>
                                        <span className="text-[10px] text-zinc-500 font-mono">{res.time}</span>
                                    </div>
                                    {res.prompt && <div className="text-xs text-zinc-400 font-medium">Q: {res.prompt}</div>}
                                    <div className="text-sm text-zinc-200 leading-relaxed font-mono">
                                        {res.text}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

function AlertButton({ label, type, emoji, onClick }) {
    return (
        <Button
            variant="outline"
            className="flex flex-col h-auto py-3 gap-2 border-zinc-800 hover:bg-primary/10 hover:border-primary/50 group transition-all"
            onClick={() => onClick(type)}
        >
            <span className="text-2xl group-hover:scale-110 transition-transform">{emoji}</span>
            <span className="text-[10px] uppercase font-bold text-zinc-500 group-hover:text-primary transition-colors">{label}</span>
        </Button>
    )
}

function StatusBadge({ label, status, meta }) {
    const isGood = status === 'Connected' || status === 'Monitoring' || status === 'Active' || status === 'Tracking'
    const isDegraded = status === 'Degraded' || status === 'Inactive'

    return (
        <div className={`p-3 rounded-lg border ${isGood ? 'bg-emerald-500/10 border-emerald-500/20' : isDegraded ? 'bg-yellow-500/10 border-yellow-500/20' : 'bg-rose-500/10 border-rose-500/20'}`}>
            <div className="flex items-center gap-2 mb-1">
                {isGood ? <CheckCircle className="h-4 w-4 text-emerald-400" /> : <XCircle className="h-4 w-4 text-rose-400" />}
                <span className={`text-xs font-bold uppercase ${isGood ? 'text-emerald-400' : 'text-rose-400'}`}>{label}</span>
            </div>
            <div className="text-lg font-bold text-white mb-1">{status}</div>
            <div className="text-[10px] font-mono text-zinc-400 truncate" title={meta}>{meta}</div>
        </div>
    )
}
