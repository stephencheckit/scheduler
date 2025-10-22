"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Code, Copy, Check } from "lucide-react"

export default function EmbedPage() {
  const [widgetId, setWidgetId] = useState("")
  const [copied, setCopied] = useState(false)
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

  useEffect(() => {
    fetchWidgetId()
  }, [])

  async function fetchWidgetId() {
    try {
      const res = await fetch("/api/user")
      if (res.ok) {
        const data = await res.json()
        setWidgetId(data.widgetId)
      }
    } catch (error) {
      console.error("Error fetching widget ID:", error)
    }
  }

  const iframeCode = `<iframe src="${appUrl}/embed/${widgetId}" width="100%" height="700" frameborder="0"></iframe>`
  
  const widgetUrl = `${appUrl}/widget/${widgetId}`

  async function copyToClipboard(text: string) {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy:", error)
    }
  }

  if (!widgetId) {
    return <div>Loading...</div>
  }

  return (
    <div className="max-w-4xl">
      <div className="flex items-center mb-6">
        <Code className="h-8 w-8 mr-3" />
        <div>
          <h1 className="text-3xl font-bold">Embed Widget</h1>
          <p className="text-zinc-600">Add the scheduling widget to your website</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white border border-zinc-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Your Widget URL</h2>
          <p className="text-sm text-zinc-600 mb-3">
            Share this link directly with your visitors:
          </p>
          <div className="flex gap-2">
            <code className="flex-1 bg-zinc-50 border border-zinc-200 rounded px-4 py-3 text-sm font-mono">
              {widgetUrl}
            </code>
            <Button
              variant="outline"
              onClick={() => copyToClipboard(widgetUrl)}
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <div className="bg-white border border-zinc-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Embed Code (iframe)</h2>
          <p className="text-sm text-zinc-600 mb-3">
            Copy and paste this code into your website's HTML:
          </p>
          <div className="flex gap-2">
            <code className="flex-1 bg-zinc-50 border border-zinc-200 rounded px-4 py-3 text-sm font-mono whitespace-pre-wrap break-all">
              {iframeCode}
            </code>
            <Button
              variant="outline"
              onClick={() => copyToClipboard(iframeCode)}
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <div className="bg-white border border-zinc-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Preview</h2>
          <div className="border border-zinc-200 rounded-lg overflow-hidden">
            <iframe
              src={`/embed/${widgetId}`}
              width="100%"
              height="700"
              className="w-full"
            />
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">Integration Tips</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Make sure you've set your availability before embedding</li>
            <li>• The widget automatically syncs with your Google Calendar</li>
            <li>• Adjust the iframe height if needed to fit your content</li>
            <li>• The widget is mobile-responsive</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

