"use client"

import { Button } from "@/components/ui/button"
import type { SavedRequest } from "@/lib/types"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Trash2, ArrowRight, BookmarkIcon } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface SavedRequestsPanelProps {
  savedRequests: SavedRequest[]
  onLoadRequest: (request: SavedRequest["request"]) => void
  onDeleteRequest: (id: string) => void
}

export function SavedRequestsPanel({ savedRequests, onLoadRequest, onDeleteRequest }: SavedRequestsPanelProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const handleDelete = (id: string) => {
    onDeleteRequest(id)
    setDeleteId(null)
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <BookmarkIcon className="h-5 w-5" />
          Saved Requests
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[200px]">
          {savedRequests.length === 0 ? (
            <div className="flex justify-center items-center h-24 text-muted-foreground text-center">
              No saved requests yet. Save a request to see it here.
            </div>
          ) : (
            <div className="space-y-2">
              {savedRequests.map((savedRequest) => (
                <div
                  key={savedRequest.id}
                  className="flex items-center justify-between p-3 border rounded-md hover:bg-accent group"
                >
                  <div className="flex-1 cursor-pointer" onClick={() => onLoadRequest(savedRequest.request)}>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={
                          savedRequest.request.method === "GET"
                            ? "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20"
                            : savedRequest.request.method === "POST"
                              ? "bg-green-500/10 text-green-500 hover:bg-green-500/20"
                              : savedRequest.request.method === "PUT"
                                ? "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20"
                                : savedRequest.request.method === "DELETE"
                                  ? "bg-red-500/10 text-red-500 hover:bg-red-500/20"
                                  : "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20"
                        }
                      >
                        {savedRequest.request.method}
                      </Badge>
                      <span className="font-medium">{savedRequest.name}</span>
                    </div>
                    <div className="text-xs text-muted-foreground truncate mt-1 max-w-[300px]">
                      {savedRequest.request.url}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteId(savedRequest.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onLoadRequest(savedRequest.request)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>This will permanently delete this saved request.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => deleteId && handleDelete(deleteId)}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  )
}
