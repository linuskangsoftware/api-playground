"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Trash2 } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card } from "@/components/ui/card"

interface HeadersEditorProps {
  headers: Record<string, string>
  onChange: (headers: Record<string, string>) => void
}

export function HeadersEditor({ headers, onChange }: HeadersEditorProps) {
  const [newKey, setNewKey] = useState("")
  const [newValue, setNewValue] = useState("")

  const handleAddHeader = () => {
    if (newKey.trim()) {
      onChange({ ...headers, [newKey]: newValue })
      setNewKey("")
      setNewValue("")
    }
  }

  const handleRemoveHeader = (key: string) => {
    const newHeaders = { ...headers }
    delete newHeaders[key]
    onChange(newHeaders)
  }

  const handleKeyChange = (oldKey: string, newKey: string) => {
    const newHeaders = { ...headers }
    const value = newHeaders[oldKey]
    delete newHeaders[oldKey]
    newHeaders[newKey] = value
    onChange(newHeaders)
  }

  const handleValueChange = (key: string, value: string) => {
    onChange({ ...headers, [key]: value })
  }

  return (
    <div className="space-y-4">
      <Card className="border-dashed">
        <ScrollArea className="h-[250px] p-4">
          {Object.keys(headers).length === 0 ? (
            <div className="text-center text-muted-foreground py-8">No headers added yet. Add a header below.</div>
          ) : (
            <div className="space-y-2">
              {Object.entries(headers).map(([key, value], index) => (
                <div key={index} className="flex gap-2 items-center group">
                  <Input
                    placeholder="Header name"
                    value={key}
                    onChange={(e) => handleKeyChange(key, e.target.value)}
                    className="flex-1"
                  />
                  <Input
                    placeholder="Value"
                    value={value}
                    onChange={(e) => handleValueChange(key, e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveHeader(key)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </Card>

      <div className="flex gap-2 items-center">
        <Input
          placeholder="Header name"
          value={newKey}
          onChange={(e) => setNewKey(e.target.value)}
          className="flex-1"
        />
        <Input placeholder="Value" value={newValue} onChange={(e) => setNewValue(e.target.value)} className="flex-1" />
        <Button onClick={handleAddHeader} disabled={!newKey.trim()} size="icon">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
