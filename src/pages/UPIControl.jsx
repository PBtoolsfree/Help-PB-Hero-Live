import React, { useState, useEffect } from 'react'
import { Save, Play, Shield, DollarSign, Activity, Key } from 'lucide-react'
import axios from 'axios'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui'

const API_URL = "/api"

export default function UPIControl({ config, onSave }) {
    const [localConfig, setLocalConfig] = useState({
        enabled: false,
        secret_key: "",
        min_amount: 10
    })

    const [testPayload, setTestPayload] = useState({
        sender: "Test User",
        amount: "100",
        message: "Hype! Great stream!",
        secret: ""
    })

    const [status, setStatus] = useState("")

    useEffect(() => {
        if (config?.upi_gateway) {
            setLocalConfig({ ...config.upi_gateway })
        }
    }, [config])

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setLocalConfig(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))
    }

    const handleSave = () => {
        const newConfig = {
            ...config,
            upi_gateway: localConfig
        }
        onSave(newConfig)
    }

    const handleTestChange = (e) => {
        setTestPayload({ ...testPayload, [e.target.name]: e.target.value })
    }

    const handleSimulate = async () => {
        setStatus("Sending...")
        try {
            // Auto-fill secret if empty and localConfig has one
            const payload = { ...testPayload }
            if (!payload.secret && localConfig.secret_key) {
                payload.secret = localConfig.secret_key
            }

            const res = await axios.post(`${API_URL}/integrations/upi/webhook`, payload)
            setStatus(`Success: ${JSON.stringify(res.data)}`)
        } catch (e) {
            setStatus(`Error: ${e.message}`)
        }
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Settings Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-primary" />
                        Gateway Configuration
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">

                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg border">
                        <div>
                            <div className="font-medium">Enable Gateway</div>
                            <div className="text-xs text-muted-foreground">Listen for incoming webhooks</div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                name="enabled"
                                checked={localConfig.enabled || false}
                                onChange={handleChange}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-2">
                            <Key className="w-4 h-4" /> Secret Key
                        </label>
                        <input
                            type="text"
                            name="secret_key"
                            value={localConfig.secret_key || ""}
                            onChange={handleChange}
                            placeholder="my_super_secure_key"
                            className="w-full px-3 py-2 bg-background border rounded-md focus:ring-2 focus:ring-primary outline-none"
                        />
                        <p className="text-xs text-muted-foreground">Required authentication token for webhooks.</p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-2">
                            <DollarSign className="w-4 h-4" /> Minimum Amount (₹)
                        </label>
                        <input
                            type="number"
                            name="min_amount"
                            value={localConfig.min_amount || 0}
                            onChange={handleChange}
                            className="w-full px-3 py-2 bg-background border rounded-md focus:ring-2 focus:ring-primary outline-none"
                        />
                    </div>

                    <button
                        onClick={handleSave}
                        className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-2 rounded-lg hover:bg-primary/90 transition-colors font-medium"
                    >
                        <Save className="h-4 w-4" /> Save Configuration
                    </button>
                </CardContent>
            </Card>

            {/* Test Console */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5 text-emerald-500" />
                        Test Console
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold uppercase text-muted-foreground">Sender</label>
                            <input
                                name="sender"
                                value={testPayload.sender}
                                onChange={handleTestChange}
                                className="w-full px-3 py-2 bg-background border rounded-md text-sm"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold uppercase text-muted-foreground">Amount (₹)</label>
                            <input
                                name="amount"
                                type="number"
                                value={testPayload.amount}
                                onChange={handleTestChange}
                                className="w-full px-3 py-2 bg-background border rounded-md text-sm"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold uppercase text-muted-foreground">Message</label>
                        <textarea
                            name="message"
                            value={testPayload.message}
                            onChange={handleTestChange}
                            className="w-full px-3 py-2 bg-background border rounded-md text-sm h-20 resize-none"
                        />
                    </div>

                    <button
                        onClick={handleSimulate}
                        className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                    >
                        <Play className="h-4 w-4" /> Simulate Payment
                    </button>

                    {status && (
                        <div className="p-3 bg-zinc-900 rounded-md border text-xs font-mono break-all">
                            {status}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Instructions */}
            <Card className="md:col-span-2">
                <CardHeader>
                    <CardTitle>Setup Instructions</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-2">
                    <p>1. Install an SMS-to-Webhook automation app on your phone (e.g., Tasker, Macrodroid).</p>
                    <p>2. Set the webhook URL to: <code className="bg-zinc-900 px-1 py-0.5 rounded text-primary">http://YOUR_PC_IP:5000/api/integrations/upi/webhook</code></p>
                    <p>3. Configure the JSON body to send: <code className="bg-zinc-900 px-1 py-0.5 rounded text-emerald-400">{`{ "sender": "Name", "amount": 100, "message": "Text", "secret": "${localConfig.secret_key}" }`}</code></p>
                </CardContent>
            </Card>

        </div>
    )
}
