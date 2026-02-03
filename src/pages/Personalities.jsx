import React, { useState, useEffect } from 'react'
import { Save, Smile, Flame, HelpingHand, Sparkles, Edit2, Check, X, RotateCcw } from 'lucide-react'
import { Card, CardHeader, CardContent, CardTitle, CardDescription, Button, Badge, Input, Textarea } from '@/components/ui'

const DEFAULT_PRESETS = [
    {
        id: 'roast',
        name: 'Roast Master',
        description: 'Savage but playful. Witty one-liners only.',
        icon_name: 'flame',
        prompt: `You are a savage but playful roast bot for live chat.
Reply with short, witty, funny one-liners.
Keep it entertaining, not toxic.
No hate, abuse, or personal attacks.
Max 1–2 lines only.`
    },
    {
        id: 'help',
        name: 'Helpful Assistant',
        description: 'Clear, simple explanations for beginners.',
        icon_name: 'helping',
        prompt: `You are a helpful assistant.
Explain clearly and simply like teaching a beginner.
Use short steps or bullets.
Give direct solutions only.
Avoid long explanations.`
    },
    {
        id: 'funny',
        name: 'High Energy',
        description: 'Goofy, meme-style, and humorous.',
        icon_name: 'smile',
        prompt: `You are goofy, meme-style, and high energy.
Make responses humorous and fun.
Add light jokes or emojis sometimes.
Keep answers short and chat-friendly.`
    },
    {
        id: 'custom',
        name: 'Dynamic Custom',
        description: 'Adapts personality based on user instruction.',
        icon_name: 'sparkles',
        prompt: `You are a dynamic custom AI.
Adapt your personality based on the user's instruction.

Rules:
- Follow the requested tone/style exactly
- Be concise for fast chat
- Keep responses short
- Avoid paragraphs

Examples:
"act like teacher" → explain simply
"be professional" → formal tone
"be funny" → add humor
"short answer" → one sentence only
"motivate me" → encouraging tone

Always adjust automatically to the user's request.`
    }
]

const ICONS = {
    flame: <Flame className="h-8 w-8 text-orange-500" />,
    helping: <HelpingHand className="h-8 w-8 text-blue-500" />,
    smile: <Smile className="h-8 w-8 text-yellow-500" />,
    sparkles: <Sparkles className="h-8 w-8 text-purple-500" />
}

export default function PersonalitiesPage({ config, onSave }) {
    const currentPrompt = config.ai_topology?.system_prompt || ""
    // Load presets from config or use defaults
    const [presets, setPresets] = useState(config.ai_topology?.presets || DEFAULT_PRESETS)
    const [editingId, setEditingId] = useState(null)
    const [editForm, setEditForm] = useState({})

    const handleApply = (preset) => {
        if (editingId) return // Don't apply while editing
        const newConfig = { ...config }
        if (!newConfig.ai_topology) newConfig.ai_topology = {}
        newConfig.ai_topology.system_prompt = preset.prompt
        onSave(newConfig)
    }

    const startEdit = (e, preset) => {
        e.stopPropagation()
        setEditingId(preset.id)
        setEditForm({ ...preset })
    }

    const cancelEdit = (e) => {
        e.stopPropagation()
        setEditingId(null)
        setEditForm({})
    }

    const saveEdit = (e) => {
        e.stopPropagation()
        const newPresets = presets.map(p => p.id === editingId ? editForm : p)
        setPresets(newPresets)

        // Save to global config
        const newConfig = { ...config }
        if (!newConfig.ai_topology) newConfig.ai_topology = {}
        newConfig.ai_topology.presets = newPresets
        // If we edited the active one, update it immediately? Maybe.
        if (currentPrompt === presets.find(p => p.id === editingId)?.prompt) {
            newConfig.ai_topology.system_prompt = editForm.prompt
        }
        onSave(newConfig)
        setEditingId(null)
    }

    const resetToDefaults = () => {
        if (confirm("Reset all personalities to default?")) {
            setPresets(DEFAULT_PRESETS)
            const newConfig = { ...config }
            if (!newConfig.ai_topology) newConfig.ai_topology = {}
            newConfig.ai_topology.presets = DEFAULT_PRESETS
            onSave(newConfig)
        }
    }

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">AI Personalities</h2>
                    <p className="text-muted-foreground">Select or customize a personality mode.</p>
                </div>
                <Button variant="outline" size="sm" onClick={resetToDefaults}>
                    <RotateCcw className="mr-2 h-4 w-4" /> Reset Defaults
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {presets.map((preset) => {
                    const isActive = currentPrompt === preset.prompt
                    const isEditing = editingId === preset.id

                    if (isEditing) {
                        return (
                            <Card key={preset.id} className="ring-2 ring-primary">
                                <CardHeader className="pb-2">
                                    <div className="flex justify-between items-center mb-2">
                                        <CardTitle className="text-sm uppercase text-primary">Editing {preset.name}</CardTitle>
                                        <div className="flex gap-1">
                                            <Button size="icon" variant="ghost" onClick={saveEdit} className="h-8 w-8 text-green-500"><Check className="h-4 w-4" /></Button>
                                            <Button size="icon" variant="ghost" onClick={cancelEdit} className="h-8 w-8 text-destructive"><X className="h-4 w-4" /></Button>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <Input
                                            value={editForm.name}
                                            onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                                            placeholder="Personality Name"
                                        />
                                        <Input
                                            value={editForm.description}
                                            onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                                            placeholder="Description"
                                        />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <Textarea
                                        value={editForm.prompt}
                                        onChange={e => setEditForm({ ...editForm, prompt: e.target.value })}
                                        className="font-mono text-xs min-h-[150px]"
                                        placeholder="System Prompt..."
                                    />
                                </CardContent>
                            </Card>
                        )
                    }

                    return (
                        <Card
                            key={preset.id}
                            className={`cursor-pointer transition-all hover:scale-[1.01] group ${isActive ? 'border-primary ring-2 ring-primary ring-offset-2' : ''}`}
                            onClick={() => handleApply(preset)}
                        >
                            <CardHeader className="flex flex-row items-center gap-4 relative">
                                <div className="p-2 bg-muted rounded-full">
                                    {ICONS[preset.icon_name] || ICONS.sparkles}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-center">
                                        <CardTitle className="text-lg">{preset.name}</CardTitle>
                                        {isActive && <Badge variant="default">Active</Badge>}
                                    </div>
                                    <CardDescription>{preset.description}</CardDescription>
                                </div>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={(e) => startEdit(e, preset)}
                                >
                                    <Edit2 className="h-4 w-4 text-muted-foreground" />
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <div className="bg-muted/50 p-3 rounded-md text-xs font-mono text-muted-foreground line-clamp-3 group-hover:line-clamp-none transition-all">
                                    {preset.prompt}
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>
        </div>
    )
}
