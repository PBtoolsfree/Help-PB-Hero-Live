import React, { useState } from 'react'
import { Shield, UserX, Zap, AlertTriangle, Save, Plus, X } from 'lucide-react'
import { Card, CardHeader, CardContent, CardTitle, Input, Button, Switch, Textarea } from '@/components/ui'

export default function ModerationPage({ config, onSave }) {
    const [localConfig, setLocalConfig] = useState(config)

    const updateNested = (path, value) => {
        const parts = path.split('.')
        const newConfig = { ...localConfig }
        let current = newConfig
        for (let i = 0; i < parts.length - 1; i++) {
            current = current[parts[i]]
        }
        current[parts[parts.length - 1]] = value
        setLocalConfig(newConfig)
    }

    const addItem = (path, value) => {
        const parts = path.split('.')
        const newConfig = { ...localConfig }
        let current = newConfig
        for (let i = 0; i < parts.length - 1; i++) {
            current = current[parts[i]]
        }
        const last = parts[parts.length - 1]
        if (!current[last].includes(value)) {
            current[last] = [...current[last], value]
            setLocalConfig(newConfig)
        }
    }

    const removeItem = (path, index) => {
        const parts = path.split('.')
        const newConfig = { ...localConfig }
        let current = newConfig
        for (let i = 0; i < parts.length - 1; i++) {
            current = current[parts[i]]
        }
        const last = parts[parts.length - 1]
        current[last] = current[last].filter((_, i) => i !== index)
        setLocalConfig(newConfig)
    }

    return (
        <div className="space-y-8 max-w-6xl mx-auto pb-10 antialiased">
            <div className="flex justify-between items-end border-b border-white/5 pb-6">
                <div>
                    <h2 className="text-3xl font-black tracking-tighter text-white flex items-center gap-3">
                        <Shield className="h-8 w-8 text-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                        MODERATION HUB
                    </h2>
                    <p className="text-muted-foreground mt-1 text-sm font-medium">Protect your community with advanced AI and spam filters.</p>
                </div>
                <Button
                    onClick={() => onSave(localConfig)}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-900/20 transition-all hover:scale-105"
                >
                    <Save className="mr-2 h-4 w-4" /> DEPLOY CHANGES
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* AI Ignore List */}
                <Card className="border-rose-500/20 bg-zinc-950/40 backdrop-blur-sm overflow-hidden group shadow-xl">
                    <div className="h-1 bg-gradient-to-r from-rose-500/0 via-rose-500 to-rose-500/0 opacity-50" />
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-rose-400 font-bold uppercase tracking-widest text-xs">
                            <UserX className="h-4 w-4" /> AI Suppression List
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex gap-2">
                            <Input
                                id="ignore-user"
                                className="bg-rose-950/20 border-rose-500/20 focus:border-rose-500/50 transition-colors"
                                placeholder="Add user to ignore..."
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        addItem('moderation.ignore_list', e.target.value)
                                        e.target.value = ''
                                    }
                                }}
                            />
                            <Button className="bg-rose-600/20 text-rose-400 hover:bg-rose-600/40" size="icon" onClick={() => {
                                const input = document.getElementById('ignore-user')
                                addItem('moderation.ignore_list', input.value)
                                input.value = ''
                            }}><Plus className="h-4 w-4" /></Button>
                        </div>
                        <div className="flex flex-wrap gap-2 min-h-[40px]">
                            {localConfig.moderation.ignore_list.length === 0 && (
                                <span className="text-[10px] text-zinc-600 font-mono italic">No users suppressed.</span>
                            )}
                            {localConfig.moderation.ignore_list.map((user, idx) => (
                                <div key={idx} className="bg-rose-500/5 text-rose-400 px-3 py-1 rounded border border-rose-500/20 text-xs font-bold flex items-center gap-2 hover:bg-rose-500/10 transition-colors">
                                    {user}
                                    <X className="h-3 w-3 cursor-pointer opacity-50 hover:opacity-100" onClick={() => removeItem('moderation.ignore_list', idx)} />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* AI Triggers */}
                <Card className="border-amber-500/20 bg-zinc-950/40 backdrop-blur-sm overflow-hidden group shadow-xl">
                    <div className="h-1 bg-gradient-to-r from-amber-500/0 via-amber-500 to-amber-500/0 opacity-50" />
                    <CardHeader className="pb-3">
                        <div className="flex justify-between items-center">
                            <CardTitle className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-widest text-xs">
                                <Zap className="h-4 w-4" /> Activation Protocols
                            </CardTitle>
                            <Switch
                                checked={localConfig.moderation.ai_triggers.enabled}
                                onCheckedChange={(c) => updateNested('moderation.ai_triggers.enabled', c)}
                                className="data-[state=checked]:bg-amber-600"
                            />
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-zinc-500 tracking-tighter">Prefixes</label>
                                <Input
                                    className="bg-zinc-900/50 border-white/5 h-8 text-xs focus:bg-amber-500/5 focus:border-amber-500/30"
                                    placeholder="e.g. !ai"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            addItem('moderation.ai_triggers.prefixes', e.target.value)
                                            e.target.value = ''
                                        }
                                    }}
                                />
                                <div className="flex flex-wrap gap-1.5 mt-2">
                                    {localConfig.moderation.ai_triggers.prefixes.map((pref, idx) => (
                                        <div key={idx} className="bg-zinc-900 text-amber-500 px-2 py-0.5 rounded text-[10px] border border-amber-500/10 font-bold flex items-center gap-1">
                                            {pref}
                                            <X className="h-2.5 w-2.5 cursor-pointer" onClick={() => removeItem('moderation.ai_triggers.prefixes', idx)} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-zinc-500 tracking-tighter">Keywords</label>
                                <Input
                                    className="bg-zinc-900/50 border-white/5 h-8 text-xs focus:bg-blue-500/5 focus:border-blue-500/30"
                                    placeholder="e.g. help"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            addItem('moderation.ai_triggers.keywords', e.target.value)
                                            e.target.value = ''
                                        }
                                    }}
                                />
                                <div className="flex flex-wrap gap-1.5 mt-2">
                                    {localConfig.moderation.ai_triggers.keywords.map((kw, idx) => (
                                        <div key={idx} className="bg-zinc-900 text-blue-400 px-2 py-0.5 rounded text-[10px] border border-blue-500/10 font-bold flex items-center gap-1">
                                            {kw}
                                            <X className="h-2.5 w-2.5 cursor-pointer" onClick={() => removeItem('moderation.ai_triggers.keywords', idx)} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Response Logic - Global */}
            <Card className="border-emerald-500/20 bg-zinc-950/40 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                    <AlertTriangle className="h-32 w-32 text-emerald-500" />
                </div>
                <CardHeader className="bg-emerald-500/5 border-b border-white/5">
                    <CardTitle className="flex items-center gap-2 text-emerald-400 font-black uppercase tracking-widest text-sm">
                        <AlertTriangle className="h-4 w-4" /> Shield Strategy Logic
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                    <div className="grid gap-12 md:grid-cols-3">
                        <div className="flex items-center gap-6 bg-zinc-900/40 p-4 rounded-xl border border-white/5">
                            <div className="h-10 w-10 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20">
                                <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
                            </div>
                            <div className="flex-1 space-y-1">
                                <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">Warning Protocol</label>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-medium text-zinc-300">Warn before timeout</span>
                                    <Switch
                                        checked={localConfig.moderation.protection_logic.warning_enabled}
                                        onCheckedChange={(c) => updateNested('moderation.protection_logic.warning_enabled', c)}
                                        className="data-[state=checked]:bg-emerald-600"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-end">
                                <label className="text-[10px] font-black uppercase text-zinc-500 tracking-wider">Warning Threshold</label>
                                <span className="text-2xl font-black text-emerald-500">{localConfig.moderation.protection_logic.max_warnings}</span>
                            </div>
                            <Input
                                type="range" min="1" max="10"
                                value={localConfig.moderation.protection_logic.max_warnings}
                                onChange={(e) => updateNested('moderation.protection_logic.max_warnings', parseInt(e.target.value))}
                                className="h-1 bg-zinc-800 accent-emerald-500 rounded-lg appearance-none cursor-pointer"
                            />
                            <p className="text-[10px] text-zinc-500 font-medium leading-tight">Allow up to {localConfig.moderation.protection_logic.max_warnings} violation(s) before decisive action.</p>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-end">
                                <label className="text-[10px] font-black uppercase text-zinc-500 tracking-wider">Containment Duration</label>
                                <span className="text-2xl font-black text-rose-500">{localConfig.moderation.protection_logic.timeout_duration}s</span>
                            </div>
                            <Input
                                type="number"
                                className="bg-zinc-900/80 border-rose-500/20 text-rose-400 font-black h-10 hover:border-rose-500/40 focus:border-rose-500 transition-all"
                                value={localConfig.moderation.protection_logic.timeout_duration}
                                onChange={(e) => updateNested('moderation.protection_logic.timeout_duration', parseInt(e.target.value))}
                            />
                            <p className="text-[10px] text-zinc-500 font-medium">Standard timeout for repeated offenses.</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Individual Filters */}
            <div className="grid gap-6 md:grid-cols-1">
                {/* 1. Spam Protection */}
                <Card className="border-blue-500/20 bg-zinc-950/40 shadow-xl group overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between bg-blue-500/5 px-6 py-4">
                        <CardTitle className="text-blue-400 font-black tracking-widest text-xs uppercase flex items-center gap-2">
                            Burst Suppression
                        </CardTitle>
                        <Switch
                            checked={localConfig.moderation.filters.spam_protection.enabled}
                            onCheckedChange={(c) => updateNested('moderation.filters.spam_protection.enabled', c)}
                            className="data-[state=checked]:bg-blue-600"
                        />
                    </CardHeader>
                    <CardContent className="p-6 grid md:grid-cols-3 gap-8">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-zinc-500">Max Messages</label>
                            <Input
                                type="number" className="bg-zinc-900/50 border-white/5 font-bold"
                                value={localConfig.moderation.filters.spam_protection.limit}
                                onChange={(e) => updateNested('moderation.filters.spam_protection.limit', parseInt(e.target.value))}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-zinc-500">Analysis Window</label>
                            <div className="relative">
                                <Input
                                    type="number" className="bg-zinc-900/50 border-white/5 font-bold pr-10"
                                    value={localConfig.moderation.filters.spam_protection.window}
                                    onChange={(e) => updateNested('moderation.filters.spam_protection.window', parseInt(e.target.value))}
                                />
                                <span className="absolute right-3 top-2 text-[10px] text-zinc-600 font-bold">SEC</span>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-zinc-500">Warning Transmission</label>
                            <Input
                                className="bg-zinc-900/50 border-white/5 italic text-zinc-400 text-xs"
                                value={localConfig.moderation.filters.spam_protection.message}
                                onChange={(e) => updateNested('moderation.filters.spam_protection.message', e.target.value)}
                                placeholder="Hey {author}, slow down!"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* 2. Blacklist */}
                <Card className="border-rose-500/20 bg-zinc-950/40 shadow-xl overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between bg-rose-500/5 px-6 py-4">
                        <CardTitle className="text-rose-400 font-black tracking-widest text-xs uppercase flex items-center gap-2">
                            Forbidden Lexicon
                        </CardTitle>
                        <Switch
                            checked={localConfig.moderation.filters.word_blacklist.enabled}
                            onCheckedChange={(c) => updateNested('moderation.filters.word_blacklist.enabled', c)}
                            className="data-[state=checked]:bg-rose-600"
                        />
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-zinc-500">Illegal Strings (Use * for Wildcard)</label>
                                <Textarea
                                    className="font-mono text-xs min-h-[120px] bg-zinc-900/80 border-rose-950/30 text-rose-100 placeholder:opacity-20 focus:border-rose-500/40"
                                    value={localConfig.moderation.filters.word_blacklist.words.join('\n')}
                                    onChange={(e) => updateNested('moderation.filters.word_blacklist.words', e.target.value.split('\n'))}
                                    placeholder="example\nforbidden*\nbadword"
                                />
                            </div>
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase text-zinc-500">Violation Response</label>
                                    <Input
                                        className="bg-zinc-900/50 border-white/5 italic text-zinc-400 text-sm"
                                        value={localConfig.moderation.filters.word_blacklist.message}
                                        onChange={(e) => updateNested('moderation.filters.word_blacklist.message', e.target.value)}
                                        placeholder="Hey {author}, that word is banned!"
                                    />
                                </div>
                                <div className="p-4 bg-rose-500/5 rounded border border-rose-500/10">
                                    <h4 className="text-[10px] font-black text-rose-400 uppercase mb-2">Blacklist Pro-Tip</h4>
                                    <p className="text-[10px] text-zinc-500 leading-relaxed italic">"Use wildcards like **spam*** to match any message that starts with 'spam'. Be careful not to block common words by accident!"</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* 3. Symbol Protection */}
                <Card className="border-cyan-500/20 bg-zinc-950/40 shadow-xl overflow-hidden pb-4">
                    <CardHeader className="flex flex-row items-center justify-between bg-cyan-500/5 px-6 py-4">
                        <CardTitle className="text-cyan-400 font-black tracking-widest text-xs uppercase flex items-center gap-2">
                            Symbol Saturation
                        </CardTitle>
                        <Switch
                            checked={localConfig.moderation.filters.excess_symbols.enabled}
                            onCheckedChange={(c) => updateNested('moderation.filters.excess_symbols.enabled', c)}
                            className="data-[state=checked]:bg-cyan-600"
                        />
                    </CardHeader>
                    <CardContent className="p-6 grid md:grid-cols-2 gap-8">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-zinc-500">Character Limit</label>
                            <Input
                                type="number" className="bg-zinc-900/50 border-white/5 font-bold"
                                value={localConfig.moderation.filters.excess_symbols.limit}
                                onChange={(e) => updateNested('moderation.filters.excess_symbols.limit', parseInt(e.target.value))}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-zinc-500">Intervention Message</label>
                            <Input
                                className="bg-zinc-900/50 border-white/5 italic text-zinc-400 text-xs"
                                value={localConfig.moderation.filters.excess_symbols.message}
                                onChange={(e) => updateNested('moderation.filters.excess_symbols.message', e.target.value)}
                                placeholder="Hey {author}, too many symbols!"
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

