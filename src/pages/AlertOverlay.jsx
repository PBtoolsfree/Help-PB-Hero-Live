import React, { useState, useEffect, useRef } from 'react'

export default function AlertOverlay() {
    const [alert, setAlert] = useState(null)
    const ws = useRef(null)

    useEffect(() => {
        const connect = () => {
            const proto = window.location.protocol === 'https:' ? 'wss' : 'ws'
            const uri = `${proto}://${window.location.host}/ws/logs`
            ws.current = new WebSocket(uri)

            ws.current.onmessage = (event) => {
                const data = JSON.parse(event.data)

                // Track Alerts (Rankups, Loyalty, UPI, Generic SB Alerts)
                if (data.type === 'alert' || data.category === 'RANK_UP' || data.category === 'LOYALTY' || data.category === 'UPI_ALERT' || data.category === 'ALERT') {
                    let title = data.category?.replace('_', ' ') || 'New Alert'
                    let emoji = data.emoji || '🔥'
                    let style = 'default'

                    if (data.category === 'UPI_ALERT') {
                        title = 'UPI RECEIVED'
                        emoji = '💸'
                        style = 'money'
                    } else if (data.category === 'ALERT') {
                        // Generic Streamer.bot Alert
                        title = 'STREAM ALERT'
                        emoji = '🔔'
                    }

                    setAlert({
                        id: Date.now(),
                        title: title,
                        message: data.message,
                        emoji: emoji,
                        style: style,
                        meta: data.meta
                    })
                }
            }

            ws.current.onclose = () => setTimeout(connect, 3000)
        }
        connect()
        return () => ws.current?.close()
    }, [])

    useEffect(() => {
        if (alert) {
            // TTS for UPI
            if (alert.style === 'money') {
                const msg = new SpeechSynthesisUtterance(`New donation of ${alert.meta?.amount || 'some'} rupees from ${alert.meta?.sender || 'someone'}. ${alert.message}`)
                msg.rate = 1.0
                msg.pitch = 1.0
                // Optional: Select a voice if needed, or default
                window.speechSynthesis.speak(msg)
            }

            const timer = setTimeout(() => setAlert(null), 5000)
            return () => {
                clearTimeout(timer)
                window.speechSynthesis.cancel()
            }
        }
    }, [alert])

    if (!alert) return null

    return (
        <div className="h-screen w-full flex items-center justify-center p-12">
            <div className="animate-in zoom-in spin-in-1 duration-500 relative">
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-primary/40 blur-3xl animate-pulse" />

                {/* Dynamic Styling based on Alert Type */}
                <div className={`
                    relative backdrop-blur-2xl border-2 p-8 rounded-3xl shadow-2xl flex flex-col items-center text-center gap-4 min-w-[400px]
                    ${alert.style === 'money'
                        ? 'bg-emerald-950/80 border-emerald-500 shadow-emerald-500/30'
                        : 'bg-black/80 border-primary shadow-[0_0_50px_rgba(var(--primary),0.3)]'}
                `}>
                    <div className="text-6xl animate-bounce">{alert.emoji}</div>
                    <div className="space-y-1">
                        <div className={`
                            font-black uppercase tracking-[0.2em] text-sm
                            ${alert.style === 'money' ? 'text-emerald-400' : 'text-primary'}
                        `}>
                            {alert.title}
                        </div>
                        <div className="text-white text-2xl font-black">
                            {alert.message}
                        </div>
                        {alert.style === 'money' && alert.meta && (
                            <div className="text-emerald-200 text-lg font-mono mt-2 bg-emerald-900/50 px-3 py-1 rounded inline-block">
                                ₹{alert.meta.amount} from {alert.meta.sender}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
