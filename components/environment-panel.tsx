"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Trash2, Eye, EyeOff, Variable } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { EnvironmentVariable } from "@/lib/types"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"

interface EnvironmentPanelProps {
  variables: EnvironmentVariable[]
  onVariablesChange: (variables: EnvironmentVariable[]) => void
}

export function EnvironmentPanel({ variables, onVariablesChange }: EnvironmentPanelProps) {
  const [newKey, setNewKey] = useState("")
  const [newValue, setNewValue] = useState("")
  const [showValues, setShowValues] = useState(false)

  const handleAddVariable = () => {
    if (newKey.trim()) {
      onVariablesChange([...variables, { key: newKey, value: newValue }])
      setNewKey("")
      setNewValue("")
    }
  }

  const handleRemoveVariable = (index: number) => {
    const newVariables = [...variables]
    newVariables.splice(index, 1)
    onVariablesChange(newVariables)
  }

  const handleKeyChange = (index: number, key: string) => {
    const newVariables = [...variables]
    newVariables[index].key = key
    onVariablesChange(newVariables)
  }

  const handleValueChange = (index: number, value: string) => {
    const newVariables = [...variables]
    newVariables[index].value = value
    onVariablesChange(newVariables)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-medium flex items-center gap-2">
            <Variable className="h-5 w-5" />
            Environment Variables
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Use &#123;&#123;variableName&#125;&#125; in your requests to reference these variables
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Switch id="show-values" checked={showValues} onCheckedChange={setShowValues} />
          <Label htmlFor="show-values" className="flex items-center text-sm">
            {showValues ? (
              <>
                <Eye className="h-4 w-4 mr-1" />
                Show Values
              </>
            ) : (
              <>
                <EyeOff className="h-4 w-4 mr-1" />
                Hide Values
              </>
            )}
          </Label>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <ScrollArea className="h-[300px]">
            <div className="p-4">
              {variables.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  No environment variables added yet. Add a variable below.
                </div>
              ) : (
                <div className="space-y-2">
                  {variables.map((variable, index) => (
                    <div key={index} className="flex gap-2 items-center group">
                      <Input
                        placeholder="Variable name"
                        value={variable.key}
                        onChange={(e) => handleKeyChange(index, e.target.value)}
                        className="flex-1"
                      />
                      <Input
                        placeholder="Value"
                        type={showValues ? "text" : "password"}
                        value={variable.value}
                        onChange={(e) => handleValueChange(index, e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveVariable(index)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <div className="flex gap-2 items-center">
        <Input
          placeholder="Variable name"
          value={newKey}
          onChange={(e) => setNewKey(e.target.value)}
          className="flex-1"
        />
        <Input
          placeholder="Value"
          type={showValues ? "text" : "password"}
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          className="flex-1"
        />
        <Button onClick={handleAddVariable} disabled={!newKey.trim()} size="icon">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
