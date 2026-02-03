import React, { useState } from 'react'
import axios from 'axios'
import { Plus, Trash2, ArrowUp, ArrowDown, Save, Zap, Check, AlertCircle, X } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent, Button, Input, Switch } from '@/components/ui'

const API_URL = "/api"

export default function Orchestrator({ config, onSave }) {
    const [localConfig, setLocalConfig] = useState(config.ai_topology || { providers: [] })
    const [testResult, setTestResult] = useState(null)
    const [loading, setLoading] = useState(false)

    // Sync state if prop changes (e.g. remotely updated)
    React.useEffect(() => {
        if (config.ai_topology) {
            setLocalConfig(config.ai_topology)
        }
    }, [config])

    const handleSave = () => {
        // Construct full config to save
        const fullConfig = { ...config, ai_topology: localConfig }
        onSave(fullConfig)
    }

    const updateProvider = (index, field, value) => {
        const newProviders = [...localConfig.providers]
        newProviders[index][field] = value
        setLocalConfig({ ...localConfig, providers: newProviders })
    }

    const addProvider = () => {
        const newProvider = {
            id: `new_provider_${Date.now()}`,
            name: "New Provider",
            type: "openai",
            api_key: "",
            enabled: true,
            models: []
        }
        setLocalConfig({ ...localConfig, providers: [...localConfig.providers, newProvider] })
    }

    const removeProvider = (index) => {
        const newProviders = [...localConfig.providers]
        newProviders.splice(index, 1)
        setLocalConfig({ ...localConfig, providers: newProviders })
    }

    const moveProvider = (index, direction) => {
        const newProviders = [...localConfig.providers]
        if (direction === -1 && index > 0) {
            [newProviders[index], newProviders[index - 1]] = [newProviders[index - 1], newProviders[index]]
        } else if (direction === 1 && index < newProviders.length - 1) {
            [newProviders[index], newProviders[index + 1]] = [newProviders[index + 1], newProviders[index]]
        }
        setLocalConfig({ ...localConfig, providers: newProviders })
    }

    const addModel = (pIndex) => {
        const newProviders = [...localConfig.providers]
        newProviders[pIndex].models.push({
            id: "new-model",
            priority: newProviders[pIndex].models.length + 1,
            enabled: true
        })
        setLocalConfig({ ...localConfig, providers: newProviders })
    }

    const removeModel = (pIndex, mIndex) => {
        const newProviders = [...localConfig.providers]
        newProviders[pIndex].models.splice(mIndex, 1)
        setLocalConfig({ ...localConfig, providers: newProviders })
    }

    const moveModel = (pIndex, mIndex, direction) => {
        const newProviders = [...localConfig.providers]
        const models = newProviders[pIndex].models
        if (direction === -1 && mIndex > 0) {
            [models[mIndex], models[mIndex - 1]] = [models[mIndex - 1], models[mIndex]]
        } else if (direction === 1 && mIndex < models.length - 1) {
            [models[mIndex], models[mIndex + 1]] = [models[mIndex + 1], models[mIndex]]
        }
        models.forEach((m, i) => m.priority = i + 1)
        setLocalConfig({ ...localConfig, providers: newProviders })
    }

    const testProvider = async (provider) => {
        setLoading(true)
        setTestResult(null)
        try {
            // We pass the full provider object so unsaved changes can be tested
            const res = await axios.post(`${API_URL}/providers/test/${provider.id}`, provider)
            setTestResult({ id: provider.id, ...res.data })
        } catch (e) {
            setTestResult({ id: provider.id, status: 'error', message: e.response?.data?.detail || e.message })
        }
        setLoading(false)
    }

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">AI Orchestration</h2>
                    <p className="text-muted-foreground">Configure providers, models, and failover priority.</p>
                </div>
                <div className="flex gap-2">
                    <Button onClick={addProvider} variant="outline"><Plus className="mr-2 h-4 w-4" /> Add Provider</Button>
                    <Button onClick={handleSave}><Save className="mr-2 h-4 w-4" /> Save Changes</Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Global System Prompt</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <textarea
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="You are a helpful AI assistant..."
                            value={localConfig.system_prompt || ''}
                            onChange={(e) => setLocalConfig({ ...localConfig, system_prompt: e.target.value })}
                        />
                        <p className="text-xs text-muted-foreground">This prompt is sent to all providers to define the AI's personality and behavior.</p>
                    </div>
                </CardContent>
            </Card>

            <div className="grid gap-6">
                {(localConfig.providers || []).map((provider, pIndex) => (
                    <Card key={provider.id} className="relative overflow-hidden group">
                        <div className={`absolute left-0 top-0 bottom-0 w-1 ${provider.enabled ? 'bg-green-500' : 'bg-muted'}`} />
                        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                            <div className="flex-1 grid gap-1">
                                <div className="flex items-center gap-3">
                                    <Input
                                        value={provider.name}
                                        onChange={(e) => updateProvider(pIndex, 'name', e.target.value)}
                                        className="font-semibold text-lg h-8 w-48 border-transparent hover:border-input focus:border-input bg-transparent px-0"
                                    />
                                    <Switch
                                        checked={provider.enabled}
                                        onCheckedChange={(c) => updateProvider(pIndex, 'enabled', c)}
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-muted-foreground uppercase tracking-wider font-mono bg-muted px-1.5 rounded">{provider.type}</span>
                                    <select
                                        className="text-xs bg-transparent text-muted-foreground border-none outline-none cursor-pointer hover:text-foreground"
                                        value={provider.type}
                                        onChange={(e) => updateProvider(pIndex, 'type', e.target.value)}
                                    >
                                        <option value="openai">OpenAI Compatible</option>
                                        <option value="ollama">Ollama</option>
                                        <option value="custom">Custom</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 opacity-50 group-hover:opacity-100 transition-opacity">
                                <Button variant="ghost" size="icon" disabled={pIndex === 0} onClick={() => moveProvider(pIndex, -1)}><ArrowUp className="h-4 w-4" /></Button>
                                <Button variant="ghost" size="icon" disabled={pIndex === localConfig.providers.length - 1} onClick={() => moveProvider(pIndex, 1)}><ArrowDown className="h-4 w-4" /></Button>
                                <Button variant="ghost" size="icon" onClick={() => removeProvider(pIndex)} className="text-destructive hover:bg-destructive/10"><Trash2 className="h-4 w-4" /></Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 md:grid-cols-2 mb-6 bg-muted/30 p-4 rounded-lg">
                                <div className="space-y-1">
                                    <label className="text-xs font-medium">API Key</label>
                                    <Input type="password" value={provider.api_key || ''} onChange={(e) => updateProvider(pIndex, 'api_key', e.target.value)} placeholder="sk-..." className="bg-background" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium">Base URL</label>
                                    <Input value={provider.base_url || ''} onChange={(e) => updateProvider(pIndex, 'base_url', e.target.value)} placeholder="https://api.openai.com/v1" className="bg-background" />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-sm font-medium pb-2 border-b">
                                    <span>Models (Priority Order)</span>
                                    <Button variant="ghost" size="sm" onClick={() => addModel(pIndex)} className="h-6 text-xs"><Plus className="h-3 w-3 mr-1" /> Add Model</Button>
                                </div>
                                {(provider.models || []).map((model, mIndex) => (
                                    <div key={mIndex} className="flex items-center gap-2">
                                        <div className="flex flex-col gap-0">
                                            <button disabled={mIndex === 0} onClick={() => moveModel(pIndex, mIndex, -1)} className="hover:text-primary disabled:opacity-20"><ArrowUp className="h-3 w-3" /></button>
                                            <button disabled={mIndex === provider.models.length - 1} onClick={() => moveModel(pIndex, mIndex, 1)} className="hover:text-primary disabled:opacity-20"><ArrowDown className="h-3 w-3" /></button>
                                        </div>
                                        <span className="font-mono text-xs w-6 text-center text-muted-foreground">{mIndex + 1}</span>
                                        <Input
                                            value={model.id}
                                            onChange={(e) => {
                                                const newModels = [...provider.models]
                                                newModels[mIndex].id = e.target.value
                                                updateProvider(pIndex, 'models', newModels)
                                            }}
                                            className="h-8 flex-1 font-mono text-xs"
                                            placeholder="Model ID"
                                        />
                                        <Switch checked={model.enabled} onCheckedChange={(c) => {
                                            const newModels = [...provider.models]
                                            newModels[mIndex].enabled = c
                                            updateProvider(pIndex, 'models', newModels)
                                        }} />
                                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeModel(pIndex, mIndex)}><X className="h-4 w-4 text-muted-foreground" /></Button>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-4 pt-4 border-t flex justify-end items-center gap-4">
                                {testResult?.id === provider.id && (
                                    <div className={`text-xs flex items-center gap-2 ${testResult.status === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                                        {testResult.status === 'success' ? <Check className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                                        {testResult.status === 'success' ? `Connected` : testResult.message}
                                    </div>
                                )}
                                <Button variant="outline" size="sm" disabled={loading} onClick={() => testProvider(provider)}>
                                    {loading && testResult?.id === provider.id ? <div className="animate-spin h-3 w-3 mr-2 border-2 border-primary border-t-transparent rounded-full" /> : <Zap className="h-3 w-3 mr-2" />}
                                    Test Connection
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
