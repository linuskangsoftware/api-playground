"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RequestPanel } from "@/components/request-panel"
import { ResponsePanel } from "@/components/response-panel"
import { HistoryPanel } from "@/components/history-panel"
import { SavedRequestsPanel } from "@/components/saved-requests-panel"
import { EnvironmentPanel } from "@/components/environment-panel"
import { useLocalStorage } from "@/hooks/use-local-storage"
import type { ApiRequest, ApiResponse, SavedRequest, EnvironmentVariable } from "@/lib/types"
import { substituteEnvVars } from "@/lib/utils"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Code, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export function ApiPlayground() {
  const [activeTab, setActiveTab] = useState("request")
  const [isLoading, setIsLoading] = useState(false)
  const [currentRequest, setCurrentRequest] = useState<ApiRequest>({
    url: "",
    method: "GET",
    headers: {},
    body: "",
  })
  const [currentResponse, setCurrentResponse] = useState<ApiResponse | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  const { data: history, setData: setHistory } = useLocalStorage<ApiRequest[]>("history", [])
  const { data: savedRequests, setData: setSavedRequests } = useLocalStorage<SavedRequest[]>("savedRequests", [])
  const { data: envVars, setData: setEnvVars } = useLocalStorage<EnvironmentVariable[]>("envVars", [])

  const handleSendRequest = async () => {
    try {
      setIsLoading(true)
      setCurrentResponse(null)

      // Apply environment variables to the request
      const processedRequest = {
        ...currentRequest,
        url: substituteEnvVars(currentRequest.url, envVars),
        headers: Object.entries(currentRequest.headers).reduce(
          (acc, [key, value]) => {
            acc[substituteEnvVars(key, envVars)] = substituteEnvVars(value, envVars)
            return acc
          },
          {} as Record<string, string>,
        ),
        body: substituteEnvVars(currentRequest.body, envVars),
      }

      // Validate URL
      if (!processedRequest.url) {
        throw new Error("URL is required")
      }

      // Prepare fetch options
      const options: RequestInit = {
        method: processedRequest.method,
        headers: processedRequest.headers,
      }

      // Add body for non-GET requests
      if (processedRequest.method !== "GET" && processedRequest.body) {
        options.body = processedRequest.body
      }

      // Send the request
      const startTime = Date.now()
      const response = await fetch(processedRequest.url, options)
      const endTime = Date.now()

      // Get response data
      const responseText = await response.text()
      let responseData
      try {
        responseData = JSON.parse(responseText)
      } catch {
        responseData = responseText
      }

      // Create response object
      const apiResponse: ApiResponse = {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        data: responseData,
        time: endTime - startTime,
        size: new TextEncoder().encode(responseText).length,
      }

      // Update state
      setCurrentResponse(apiResponse)

      // Add to history
      const updatedHistory = [{ ...currentRequest, timestamp: new Date().toISOString() }, ...history].slice(0, 50) // Limit history to 50 items
      setHistory(updatedHistory)

      // Switch to response tab
      setActiveTab("response")
    } catch (error) {
      toast({
        title: "Request Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveRequest = (name: string) => {
    const newSavedRequest: SavedRequest = {
      id: Date.now().toString(),
      name,
      request: { ...currentRequest },
      createdAt: new Date().toISOString(),
    }

    setSavedRequests([...savedRequests, newSavedRequest])
    toast({
      title: "Request Saved",
      description: `"${name}" has been saved to your collection`,
    })
  }

  const handleLoadRequest = (request: ApiRequest) => {
    setCurrentRequest(request)
    setActiveTab("request")
  }

  const handleClearHistory = () => {
    setHistory([])
    toast({
      title: "History Cleared",
      description: "Your request history has been cleared",
    })
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              <span className="text-xl font-bold">API Playground</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 container mx-auto p-4 space-y-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="bg-card rounded-lg shadow-sm border">
            <TabsList className="w-full justify-start rounded-none border-b p-0 h-auto">
              <TabsTrigger
                value="request"
                className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary py-3 px-6"
              >
                Request
              </TabsTrigger>
              <TabsTrigger
                value="response"
                className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary py-3 px-6"
              >
                Response
              </TabsTrigger>
              <TabsTrigger
                value="history"
                className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary py-3 px-6"
              >
                History
              </TabsTrigger>
              <TabsTrigger
                value="environment"
                className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary py-3 px-6"
              >
                Environment
              </TabsTrigger>
            </TabsList>

            <div className="p-6">
              <TabsContent value="request" className="space-y-6 mt-0">
                <RequestPanel
                  request={currentRequest}
                  onRequestChange={setCurrentRequest}
                  onSendRequest={handleSendRequest}
                  onSaveRequest={handleSaveRequest}
                  isLoading={isLoading}
                />
                <SavedRequestsPanel
                  savedRequests={savedRequests}
                  onLoadRequest={handleLoadRequest}
                  onDeleteRequest={(id) => {
                    setSavedRequests(savedRequests.filter((req) => req.id !== id))
                  }}
                />
              </TabsContent>

              <TabsContent value="response" className="mt-0">
                {isLoading ? (
                  <div className="flex flex-col justify-center items-center h-64">
                    <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                    <span className="text-lg">Sending request...</span>
                  </div>
                ) : (
                  <ResponsePanel response={currentResponse} />
                )}
              </TabsContent>

              <TabsContent value="history" className="mt-0">
                <HistoryPanel history={history} onLoadRequest={handleLoadRequest} onClearHistory={handleClearHistory} />
              </TabsContent>

              <TabsContent value="environment" className="mt-0">
                <EnvironmentPanel variables={envVars} onVariablesChange={setEnvVars} />
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </div>

      <Toaster />

      <footer className="text-center text-sm text-muted-foreground py-4">
        © 2025 Linus Kang. API Playground is 
        <a
          href="https://github.com/linuskangsoftware/api-playground"
          target="_blank"
          rel="noopener noreferrer"
          className="ml-1 inline-block underline hover:text-primary transition"
        >
          Open Source
        </a>
      </footer>
    </div>
  )
}