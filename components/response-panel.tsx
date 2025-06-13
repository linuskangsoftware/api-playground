"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import type { ApiResponse } from "@/lib/types"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Copy, Database } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent } from "@/components/ui/card"

interface ResponsePanelProps {
  response: ApiResponse | null
}

export function ResponsePanel({ response }: ResponsePanelProps) {
  const { toast } = useToast()

  if (!response) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <Database className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">No Response Yet</h3>
        <p className="text-muted-foreground max-w-md">
          Send a request to see the response details here. You'll be able to view formatted JSON, raw text, and headers.
        </p>
      </div>
    )
  }

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return "bg-green-500"
    if (status >= 300 && status < 400) return "bg-blue-500"
    if (status >= 400 && status < 500) return "bg-yellow-500"
    if (status >= 500) return "bg-red-500"
    return "bg-gray-500"
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to clipboard",
      description: `${label} has been copied to your clipboard`,
    })
  }

  const formatJson = (data: any) => {
    try {
      if (typeof data === "string") {
        return JSON.stringify(JSON.parse(data), null, 2)
      }
      return JSON.stringify(data, null, 2)
    } catch (e) {
      return typeof data === "string" ? data : JSON.stringify(data)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-muted/30 p-4 rounded-lg border">
        <div>
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(response.status)}>
              {response.status} {response.statusText}
            </Badge>
            <span className="text-sm font-medium">{response.time} ms</span>
            <span className="text-sm text-muted-foreground">{(response.size / 1024).toFixed(2)} KB</span>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            copyToClipboard(
              typeof response.data === "string" ? response.data : JSON.stringify(response.data, null, 2),
              "Response",
            )
          }
        >
          <Copy className="h-4 w-4 mr-2" />
          Copy Response
        </Button>
      </div>

      <Tabs defaultValue="json" className="w-full">
        <TabsList className="w-full grid grid-cols-3 mb-4">
          <TabsTrigger value="json">JSON</TabsTrigger>
          <TabsTrigger value="raw">Raw</TabsTrigger>
          <TabsTrigger value="headers">Headers</TabsTrigger>
        </TabsList>

        <TabsContent value="json">
          <Card>
            <CardContent className="p-0">
              <ScrollArea className="h-[400px] rounded-md p-0">
                <pre className="font-mono text-sm whitespace-pre-wrap p-4">{formatJson(response.data)}</pre>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="raw">
          <Card>
            <CardContent className="p-0">
              <ScrollArea className="h-[400px] rounded-md p-0">
                <pre className="font-mono text-sm whitespace-pre-wrap p-4">
                  {typeof response.data === "string" ? response.data : JSON.stringify(response.data)}
                </pre>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="headers">
          <Card>
            <CardContent className="p-0">
              <ScrollArea className="h-[400px] rounded-md p-0">
                <div className="p-4">
                  <table className="w-full">
                    <thead className="border-b">
                      <tr>
                        <th className="text-left py-2 px-4 font-medium">Header</th>
                        <th className="text-left py-2 px-4 font-medium">Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(response.headers).map(([key, value], index) => (
                        <tr key={index} className="border-b border-border/40">
                          <td className="py-2 px-4 font-medium">{key}</td>
                          <td className="py-2 px-4 break-all">{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
