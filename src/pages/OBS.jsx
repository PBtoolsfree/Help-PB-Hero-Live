import React, { useState } from 'react'
import { Copy, Check, Monitor, Volume2, Info } from 'lucide-react'
import { Card, CardHeader, CardContent, CardTitle, Button } from '@/components/ui'

export default function OBSPage({ config, onSave }) {
    const [copiedMap, setCopiedMap] = useState({})

    // Config values
    const audioCfg = config?.audio || {}
    const gamingPcIp = audioCfg.gaming_pc_ip || '127.0.0.1'
    const [localIp, setLocalIp] = useState(gamingPcIp)

    // Derived URLs - Use hostname instead of hardcoded localhost
    const host = window.location.host

    const chatOverlayUrl = `http://${host}/?mode=chat`


    // Audio URLs use the Gaming PC IP and dynamic ports
    const publicAudioUrl = `udp://${gamingPcIp}:${audioCfg.udp_ports?.public || 1234}`
    const secretAudioUrl = `udp://${gamingPcIp}:${audioCfg.udp_ports?.secret || 1235}`

    const copyToClipboard = (text, key) => {
        navigator.clipboard.writeText(text)
        setCopiedMap(prev => ({ ...prev, [key]: true }))
        setTimeout(() => {
            setCopiedMap(prev => ({ ...prev, [key]: false }))
        }, 2000)
    }

    const handleUpdateIp = () => {
        const newConfig = {
            ...config,
            audio: {
                ...audioCfg,
                gaming_pc_ip: localIp
            }
        }
        onSave(newConfig)
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div>
                <div className="flex justify-between items-end">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">OBS Integration</h2>
                        <p className="text-muted-foreground">Quickly set up your stream overlays and audio feeds.</p>
                    </div>

                    <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-3 rounded-xl">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Gaming PC IP</label>
                            <input
                                type="text"
                                value={localIp}
                                onChange={(e) => setLocalIp(e.target.value)}
                                className="bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary w-40"
                                placeholder="192.168.1.10"
                            />
                        </div>
                        <div className="pt-4">
                            <button
                                onClick={handleUpdateIp}
                                className="bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-lg px-4 py-1.5 text-xs font-bold transition-all active:scale-95"
                            >
                                SET DESTINATION
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">


                    {/* Chat Overlay Card */}
                    <Card className="border-emerald-500/20 bg-emerald-500/5">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Monitor className="h-5 w-5 text-emerald-400" /> Animated Chat Overlay
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                                Animated chat messages with auto-fade and highlights.
                            </p>
                            <div className="flex gap-2">
                                <div className="flex-1 bg-black/40 p-2 rounded border font-mono text-xs truncate">
                                    {chatOverlayUrl}
                                </div>
                                <Button size="sm" variant="outline" onClick={() => copyToClipboard(chatOverlayUrl, 'chat')}>
                                    {copiedMap['chat'] ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>



                    {/* Audio Source Card */}
                    <Card className="border-blue-500/20 bg-blue-500/5">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Volume2 className="h-5 w-5 text-blue-400" /> Audio Engine (UDP)
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                                Add these to OBS to hear the AI voice.
                            </p>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase text-muted-foreground">Public (Chat)</label>
                                <div className="flex gap-2">
                                    <div className="flex-1 bg-black/40 p-2 rounded border font-mono text-xs truncate">
                                        {publicAudioUrl}
                                    </div>
                                    <Button size="sm" variant="outline" onClick={() => copyToClipboard(publicAudioUrl, 'public')}>
                                        {copiedMap['public'] ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase text-muted-foreground">Secret (System)</label>
                                <div className="flex gap-2">
                                    <div className="flex-1 bg-black/40 p-2 rounded border font-mono text-xs truncate">
                                        {secretAudioUrl}
                                    </div>
                                    <Button size="sm" variant="outline" onClick={() => copyToClipboard(secretAudioUrl, 'secret')}>
                                        {copiedMap['secret'] ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                                    </Button>
                                </div>
                            </div>

                            <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                                <h4 className="text-xs font-bold uppercase mb-2 flex items-center gap-1">
                                    <Info className="h-3 w-3" /> OBS Setup
                                </h4>
                                <ul className="text-[11px] space-y-1 text-zinc-300 list-disc ml-4">
                                    <li>Add <b>Media Source</b></li>
                                    <li>Uncheck <b>Local File</b></li>
                                    <li>Input: UDP URL above</li>
                                    <li>Input Format: <b>mpegts</b></li>
                                </ul>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
