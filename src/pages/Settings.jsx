import React, { useState } from 'react'
import { Save } from 'lucide-react'
import { Card, CardHeader, CardContent, CardTitle, Input, Button, Switch } from '@/components/ui'

export default function SettingsPage({ config, onSave }) {
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

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Bot Settings</h2>
                    <p className="text-muted-foreground">Configure connection details and behaviors.</p>
                </div>
                <Button onClick={() => onSave(localConfig)}><Save className="mr-2 h-4 w-4" /> Save Settings</Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>YouTube Connection</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium">Video ID</label>
                            <Input
                                value={localConfig.youtube.video_id}
                                onChange={(e) => updateNested('youtube.video_id', e.target.value)}
                                placeholder="jfKfPfyjrdk"
                            />
                            <p className="text-xs text-muted-foreground">The ID from the URL of your livestream.</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Streamer.bot Integration</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium">Enabled</label>
                            <Switch
                                checked={localConfig.streamer_bot.enabled}
                                onCheckedChange={(c) => updateNested('streamer_bot.enabled', c)}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-sm font-medium">Host</label>
                                <Input
                                    value={localConfig.streamer_bot.host}
                                    onChange={(e) => updateNested('streamer_bot.host', e.target.value)}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium">Port</label>
                                <Input
                                    value={localConfig.streamer_bot.port}
                                    onChange={(e) => updateNested('streamer_bot.port', parseInt(e.target.value) || 8080)}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Audio Engine</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium">Enabled</label>
                            <Switch
                                checked={localConfig.audio?.enabled}
                                onCheckedChange={(c) => updateNested('audio.enabled', c)}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-sm font-medium">Voice</label>
                                <Input
                                    value={localConfig.audio?.voice}
                                    onChange={(e) => updateNested('audio.voice', e.target.value)}
                                    placeholder="en-IN-NeerjaNeural"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium">Volume</label>
                                <Input
                                    value={localConfig.audio?.volume}
                                    onChange={(e) => updateNested('audio.volume', e.target.value)}
                                    placeholder="+0%"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-sm font-medium">Public Port</label>
                                <Input
                                    value={localConfig.audio?.udp_ports?.public}
                                    onChange={(e) => updateNested('audio.udp_ports.public', parseInt(e.target.value))}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium">Secret Port</label>
                                <Input
                                    value={localConfig.audio?.udp_ports?.secret}
                                    onChange={(e) => updateNested('audio.udp_ports.secret', parseInt(e.target.value))}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Commands</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium">Enable Commands</label>
                            <Switch
                                checked={localConfig.commands.enabled}
                                onCheckedChange={(c) => updateNested('commands.enabled', c)}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium">Prefix</label>
                            <Input
                                value={localConfig.commands.prefix}
                                onChange={(e) => updateNested('commands.prefix', e.target.value)}
                                className="w-20"
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>AI Chat Triggers</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium">Enable Monitoring</label>
                            <Switch
                                checked={localConfig.moderation?.ai_triggers?.enabled}
                                onCheckedChange={(c) => updateNested('moderation.ai_triggers.enabled', c)}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium">Trigger Prefixes</label>
                            <Input
                                value={(localConfig.moderation?.ai_triggers?.prefixes || []).join(', ')}
                                onChange={(e) => updateNested('moderation.ai_triggers.prefixes', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                                placeholder="!ai, !ask"
                            />
                            <p className="text-xs text-muted-foreground">Comma-separated e.g. !ai, !bot</p>
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium">Trigger Keywords</label>
                            <Input
                                value={(localConfig.moderation?.ai_triggers?.keywords || []).join(', ')}
                                onChange={(e) => updateNested('moderation.ai_triggers.keywords', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                                placeholder="hey bot, pi"
                            />
                            <p className="text-xs text-muted-foreground">Phrases that trigger AI anywhere in a message.</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Cooldown Management</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-sm font-medium">Global (Seconds)</label>
                                <Input
                                    type="number"
                                    value={localConfig.cooldowns?.global || 15}
                                    onChange={(e) => updateNested('cooldowns.global', parseInt(e.target.value) || 0)}
                                    placeholder="15"
                                />
                                <p className="text-xs text-muted-foreground">Min time between ANY AI reply.</p>
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium">Per User (Seconds)</label>
                                <Input
                                    type="number"
                                    value={localConfig.cooldowns?.user || 60}
                                    onChange={(e) => updateNested('cooldowns.user', parseInt(e.target.value) || 0)}
                                    placeholder="60"
                                />
                                <p className="text-xs text-muted-foreground">Wait time for same user.</p>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium">Warning Message</label>
                            <Input
                                value={localConfig.cooldowns?.warning_message || ''}
                                onChange={(e) => updateNested('cooldowns.warning_message', e.target.value)}
                                placeholder="System busy..."
                            />
                            <div className="flex gap-2 mt-2">
                                <Button size="xs" variant="outline" onClick={() => updateNested('cooldowns.warning_message', "System busy hai, kripya pratiksha karein.")}>
                                    Professional
                                </Button>
                                <Button size="xs" variant="outline" onClick={() => updateNested('cooldowns.warning_message', "Arre bhai, machine garam ho jayegi, thoda ruko!")}>
                                    Desi Style
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Global System Prompt</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <textarea
                            className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-mono"
                            placeholder="You are a helpful AI assistant..."
                            value={localConfig.ai_topology?.system_prompt || ''}
                            onChange={(e) => updateNested('ai_topology.system_prompt', e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground mt-2">
                            This prompt defines the AI's core personality. Saving here updates it instantly for real-time chat.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
