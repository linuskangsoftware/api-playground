"use client"

import { Button } from "@/components/ui/button"
import type { ApiRequest } from "@/lib/types"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Trash2, Clock, ArrowRight, History } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { Card, CardContent } from "@/components/ui/card"

interface HistoryPanelProps {
  history: ApiRequest[]
  onLoadRequest: (request: ApiRequest) => void
  onClearHistory: () => void
}

export function HistoryPanel({ history, onLoadRequest, onClearHistory }: HistoryPanelProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium flex items-center gap-2">
          <History className="h-5 w-5" />
          Request History
        </h2>
        <Button variant="outline" size="sm" onClick={onClearHistory} disabled={history.length === 0}>
          <Trash2 className="h-4 w-4 mr-2" />
          Clear History
        </Button>
      </div>

      {history.length === 0 ? (
        <div className="flex flex-col justify-center items-center h-64 text-center">
          <Clock className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No Request History</h3>
          <p className="text-muted-foreground max-w-md">
            Your request history will appear here after you send requests. You can reload past requests with a single
            click.
          </p>
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <ScrollArea className="h-[500px]">
              <div className="p-4 space-y-2">
                {history.map((request, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-md hover:bg-accent cursor-pointer group"
                    onClick={() => onLoadRequest(request)}
                  >
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={
                            request.method === "GET"
                              ? "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20"
                              : request.method === "POST"
                                ? "bg-green-500/10 text-green-500 hover:bg-green-500/20"
                                : request.method === "PUT"
                                  ? "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20"
                                  : request.method === "DELETE"
                                    ? "bg-red-500/10 text-red-500 hover:bg-red-500/20"
                                    : "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20"
                          }
                        >
                          {request.method}
                        </Badge>
                        <span className="font-medium truncate max-w-[300px]">{request.url}</span>
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        {request.timestamp && formatDistanceToNow(new Date(request.timestamp), { addSuffix: true })}
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
