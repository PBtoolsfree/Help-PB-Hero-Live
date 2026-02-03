import React, { useState } from 'react'
import { UserX, Plus, X, Search, ShieldBan } from 'lucide-react'
import { Card, CardHeader, CardContent, CardTitle, Input, Button } from '@/components/ui'

export default function IgnoreListPage({ config, onSave }) {
    const [localConfig, setLocalConfig] = useState(config)
    const [searchTerm, setSearchTerm] = useState('')

    const addItem = (value) => {
        if (!value) return
        const currentList = localConfig.moderation?.ignore_list || []
        if (!currentList.includes(value)) {
            const newConfig = {
                ...localConfig,
                moderation: {
                    ...localConfig.moderation,
                    ignore_list: [...currentList, value]
                }
            }
            setLocalConfig(newConfig)
            onSave(newConfig)
        }
    }

    const removeItem = (index) => {
        const currentList = localConfig.moderation?.ignore_list || []
        const newConfig = {
            ...localConfig,
            moderation: {
                ...localConfig.moderation,
                ignore_list: currentList.filter((_, i) => i !== index)
            }
        }
        setLocalConfig(newConfig)
        onSave(newConfig)
    }

    const filteredList = (localConfig.moderation?.ignore_list || []).filter(u =>
        u.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                        <ShieldBan className="h-8 w-8 text-rose-500" />
                        Ignore List
                    </h2>
                    <p className="text-muted-foreground">
                        Users on this list are <strong>completely ignored</strong>.
                        No voice, no replies, no actions.
                    </p>
                </div>
            </div>

            <Card className="border-rose-500/20 bg-rose-500/5">
                <CardHeader>
                    <CardTitle className="text-lg">Add to Ignore List</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex gap-2">
                        <Input
                            id="add-ignore"
                            placeholder="Enter username (e.g. Nightbot)..."
                            className="bg-black/20 border-rose-500/30 focus-visible:ring-rose-500"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    addItem(e.target.value)
                                    e.target.value = ''
                                }
                            }}
                        />
                        <Button
                            className="bg-rose-600 hover:bg-rose-500 text-white"
                            onClick={() => {
                                const input = document.getElementById('add-ignore')
                                addItem(input.value)
                                input.value = ''
                            }}
                        >
                            <Plus className="mr-2 h-4 w-4" /> Add
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search ignored users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 bg-zinc-900/50 border-white/10"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredList.map((user, idx) => (
                    <div key={idx} className="group relative flex items-center justify-between p-3 rounded-lg border border-white/5 bg-zinc-900/80 hover:border-rose-500/30 transition-all">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-500 font-bold text-xs uppercase">
                                {user.substring(0, 2)}
                            </div>
                            <span className="font-mono text-sm">{user}</span>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeItem(idx)}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                ))}
                {filteredList.length === 0 && (
                    <div className="col-span-full py-8 text-center text-muted-foreground italic border border-dashed border-white/10 rounded-lg">
                        {searchTerm ? 'No matching users found.' : 'List is empty. Everyone is being heard!'}
                    </div>
                )}
            </div>
        </div>
    )
}
