"use client"

import { Button } from "@/components/ui/button"
import { Clock } from "lucide-react"

interface TimeSlotsProps {
  slots: string[]
  selectedSlot: string | null
  onSelectSlot: (slot: string) => void
  loading?: boolean
}

export function TimeSlots({ slots, selectedSlot, onSelectSlot, loading }: TimeSlotsProps) {
  if (loading) {
    return (
      <div className="bg-white border border-zinc-200 rounded-lg p-6 text-center">
        <Clock className="h-8 w-8 mx-auto text-zinc-400 mb-2 animate-spin" />
        <p className="text-zinc-600">Loading available times...</p>
      </div>
    )
  }

  if (slots.length === 0) {
    return (
      <div className="bg-white border border-zinc-200 rounded-lg p-6 text-center">
        <Clock className="h-8 w-8 mx-auto text-zinc-400 mb-2" />
        <p className="text-zinc-600">No available times for this date</p>
      </div>
    )
  }

  return (
    <div className="bg-white border border-zinc-200 rounded-lg p-4">
      <h3 className="font-semibold mb-3">Available Times</h3>
      <div className="grid grid-cols-3 gap-2 max-h-96 overflow-y-auto">
        {slots.map((slot) => (
          <Button
            key={slot}
            variant={selectedSlot === slot ? "default" : "outline"}
            onClick={() => onSelectSlot(slot)}
            className="text-sm"
          >
            {slot}
          </Button>
        ))}
      </div>
    </div>
  )
}

