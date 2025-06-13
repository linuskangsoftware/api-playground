"use client"

import { useState, useEffect } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Check, AlertCircle, Code } from "lucide-react"
import { Card } from "@/components/ui/card"

interface JsonEditorProps {
  value: string
  onChange: (value: string) => void
}

export function JsonEditor({ value, onChange }: JsonEditorProps) {
  const [isValid, setIsValid] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    if (!value.trim()) {
      setIsValid(true)
      return
    }

    try {
      JSON.parse(value)
      setIsValid(true)
    } catch (e) {
      setIsValid(false)
    }
  }, [value])

  const formatJson = () => {
    try {
      if (!value.trim()) return
      const parsed = JSON.parse(value)
      const formatted = JSON.stringify(parsed, null, 2)
      onChange(formatted)
      toast({
        title: "JSON Formatted",
        description: "Your JSON has been formatted successfully",
      })
    } catch (e) {
      toast({
        title: "Invalid JSON",
        description: "Please fix the JSON syntax errors before formatting",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-2">
      <Card className="border-dashed">
        <div className="relative">
          <div className="absolute top-2 right-2 flex gap-2">
            {value.trim() &&
              (isValid ? (
                <div className="bg-green-500/10 text-green-500 p-1 rounded-md flex items-center">
                  <Check className="h-4 w-4" />
                  <span className="text-xs ml-1">Valid JSON</span>
                </div>
              ) : (
                <div className="bg-red-500/10 text-red-500 p-1 rounded-md flex items-center">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-xs ml-1">Invalid JSON</span>
                </div>
              ))}
          </div>
          <Textarea
            placeholder="Enter JSON body"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="min-h-[250px] font-mono resize-y p-4"
          />
        </div>
      </Card>
      <div className="flex justify-end">
        <Button variant="outline" onClick={formatJson} disabled={!value.trim() || !isValid} className="gap-2">
          <Code className="h-4 w-4" />
          Format JSON
        </Button>
      </div>
    </div>
  )
}
