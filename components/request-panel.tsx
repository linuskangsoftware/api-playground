"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { HeadersEditor } from "@/components/headers-editor"
import { JsonEditor } from "@/components/json-editor"
import type { ApiRequest } from "@/lib/types"
import { Send, Save, Globe } from "lucide-react"
import { Loader2 } from "lucide-react"

interface RequestPanelProps {
  request: ApiRequest
  onRequestChange: (request: ApiRequest) => void
  onSendRequest: () => void
  onSaveRequest: (name: string) => void
  isLoading: boolean
}

export function RequestPanel({ request, onRequestChange, onSendRequest, onSaveRequest, isLoading }: RequestPanelProps) {
  const [saveDialogOpen, setSaveDialogOpen] = useState(false)
  const [requestName, setRequestName] = useState("")
  const [activeTab, setActiveTab] = useState("headers")

  const handleMethodChange = (method: string) => {
    onRequestChange({ ...request, method })
  }

  const handleUrlChange = (url: string) => {
    onRequestChange({ ...request, url })
  }

  const handleHeadersChange = (headers: Record<string, string>) => {
    onRequestChange({ ...request, headers })
  }

  const handleBodyChange = (body: string) => {
    onRequestChange({ ...request, body })
  }

  const handleSaveRequest = () => {
    onSaveRequest(requestName)
    setRequestName("")
    setSaveDialogOpen(false)
  }

  const methodColors: Record<string, string> = {
    GET: "bg-blue-500",
    POST: "bg-green-500",
    PUT: "bg-yellow-500",
    DELETE: "bg-red-500",
    PATCH: "bg-purple-500",
    HEAD: "bg-gray-500",
    OPTIONS: "bg-gray-500",
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-3 lg:col-span-2">
            <Label htmlFor="method" className="mb-2 block">
              Method
            </Label>
            <Select value={request.method} onValueChange={handleMethodChange}>
              <SelectTrigger id="method" className="w-full">
                <SelectValue placeholder="Method" />
              </SelectTrigger>
              <SelectContent>
                {["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"].map((method) => (
                  <SelectItem key={method} value={method}>
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-2 ${methodColors[method]}`}></div>
                      {method}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-12 md:col-span-9 lg:col-span-10">
            <Label htmlFor="url" className="mb-2 block">
              URL
            </Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Globe className="h-4 w-4 text-muted-foreground" />
              </div>
              <Input
                id="url"
                placeholder="Enter URL (e.g. https://api.example.com/data)"
                value={request.url}
                onChange={(e) => handleUrlChange(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        <div className="bg-muted/40 rounded-lg p-4 border">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="headers">Headers</TabsTrigger>
              <TabsTrigger value="body">Body</TabsTrigger>
            </TabsList>
            <TabsContent value="headers" className="pt-2">
              <HeadersEditor headers={request.headers} onChange={handleHeadersChange} />
            </TabsContent>
            <TabsContent value="body" className="pt-2">
              <JsonEditor value={request.body} onChange={handleBodyChange} />
            </TabsContent>
          </Tabs>
        </div>

        <div className="flex justify-end gap-2">
          <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Save className="mr-2 h-4 w-4" />
                Save
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Save Request</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <Label htmlFor="request-name">Request Name</Label>
                <Input
                  id="request-name"
                  value={requestName}
                  onChange={(e) => setRequestName(e.target.value)}
                  placeholder="My API Request"
                  className="mt-2"
                />
              </div>
              <DialogFooter>
                <Button onClick={handleSaveRequest} disabled={!requestName.trim()}>
                  Save Request
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button onClick={onSendRequest} disabled={isLoading || !request.url.trim()} className="px-6">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Send
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
