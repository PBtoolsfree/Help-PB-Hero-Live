import React, { useState, useEffect, useRef } from 'react'

export default function ChatOverlay() {
    const [messages, setMessages] = useState([])
    const ws = useRef(null)

    useEffect(() => {
        const connect = () => {
            const proto = window.location.protocol === 'https:' ? 'wss' : 'ws'
            const uri = `${proto}://${window.location.host}/ws/logs`
            ws.current = new WebSocket(uri)

            ws.current.onmessage = (event) => {
                const data = JSON.parse(event.data)
                // Allow CHAT, AI_RESPONSE, and ALERT
                if (data.type === 'log' && ['CHAT', 'AI_RESPONSE', 'ALERT'].includes(data.category)) {
                    const newMessage = {
                        id: Date.now() + Math.random(),
                        author: data.author || (data.category === 'AI_RESPONSE' ? 'Kobe Bot' : 'System'),
                        text: data.message.includes(': ') ? data.message.split(': ').slice(1).join(': ') : data.message,
                        timestamp: Date.now()
                    }
                    setMessages(prev => [...prev.slice(-15), newMessage])
                }
            }

            ws.current.onclose = () => setTimeout(connect, 3000)
        }
        connect()
        return () => ws.current?.close()
    }, [])

    return (
        <div className="h-screen w-full overflow-hidden flex flex-col justify-end p-6 font-sans">
            <div className="space-y-3 max-w-md">
                {messages.map(msg => (
                    <ChatMessage key={msg.id} msg={msg} />
                ))}
            </div>
        </div>
    )
}

function ChatMessage({ msg }) {
    const [visible, setVisible] = useState(true)

    useEffect(() => {
        const timer = setTimeout(() => setVisible(false), 8000) // Auto-fade after 8s
        return () => clearTimeout(timer)
    }, [])

    if (!visible) return null

    return (
        <div className="animate-in slide-in-from-left duration-300 flex flex-col">
            <div className="flex items-start gap-2">
                <div className="bg-black/60 backdrop-blur-md border-l-4 border-primary px-3 py-2 rounded-r-lg shadow-2xl">
                    <span className="text-primary font-black uppercase text-xs tracking-widest block mb-0.5">
                        {msg.author}
                    </span>
                    <p className="text-white text-sm font-medium leading-tight">
                        {msg.text}
                    </p>
                </div>
            </div>
        </div>
    )
}
