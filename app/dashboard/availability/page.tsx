"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Clock } from "lucide-react"

const DAYS_OF_WEEK = [
  { value: 0, label: "Sunday" },
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
]

type AvailabilitySlot = {
  dayOfWeek: number
  startTime: string
  endTime: string
  enabled: boolean
}

export default function AvailabilityPage() {
  const [availability, setAvailability] = useState<AvailabilitySlot[]>(
    DAYS_OF_WEEK.map(day => ({
      dayOfWeek: day.value,
      startTime: "09:00",
      endTime: "17:00",
      enabled: day.value >= 1 && day.value <= 5, // Default Mon-Fri
    }))
  )
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    fetchAvailability()
  }, [])

  async function fetchAvailability() {
    try {
      const res = await fetch("/api/availability")
      if (res.ok) {
        const data = await res.json()
        if (data.length > 0) {
          const newAvailability = DAYS_OF_WEEK.map(day => {
            const existing = data.find((a: any) => a.dayOfWeek === day.value)
            if (existing) {
              return {
                dayOfWeek: day.value,
                startTime: existing.startTime,
                endTime: existing.endTime,
                enabled: true,
              }
            }
            return {
              dayOfWeek: day.value,
              startTime: "09:00",
              endTime: "17:00",
              enabled: false,
            }
          })
          setAvailability(newAvailability)
        }
      }
    } catch (error) {
      console.error("Error fetching availability:", error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    setSaving(true)
    setMessage("")
    try {
      const enabled = availability.filter(a => a.enabled)
      const res = await fetch("/api/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ availability: enabled }),
      })

      if (res.ok) {
        setMessage("Availability saved successfully!")
        setTimeout(() => setMessage(""), 3000)
      } else {
        setMessage("Error saving availability")
      }
    } catch (error) {
      setMessage("Error saving availability")
    } finally {
      setSaving(false)
    }
  }

  function updateDay(dayOfWeek: number, field: keyof AvailabilitySlot, value: any) {
    setAvailability(prev =>
      prev.map(day =>
        day.dayOfWeek === dayOfWeek ? { ...day, [field]: value } : day
      )
    )
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center mb-6">
        <Clock className="h-8 w-8 mr-3" />
        <div>
          <h1 className="text-3xl font-bold">Availability</h1>
          <p className="text-zinc-600">Set your weekly schedule</p>
        </div>
      </div>

      <div className="bg-white border border-zinc-200 rounded-lg p-6">
        <div className="space-y-4">
          {DAYS_OF_WEEK.map(day => {
            const slot = availability.find(a => a.dayOfWeek === day.value)!
            return (
              <div key={day.value} className="flex items-center gap-4">
                <div className="w-32">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={slot.enabled}
                      onChange={(e) =>
                        updateDay(day.value, "enabled", e.target.checked)
                      }
                      className="mr-2 h-4 w-4"
                    />
                    <span className="font-medium">{day.label}</span>
                  </label>
                </div>
                {slot.enabled && (
                  <>
                    <div>
                      <Input
                        type="time"
                        value={slot.startTime}
                        onChange={(e) =>
                          updateDay(day.value, "startTime", e.target.value)
                        }
                        className="w-32"
                      />
                    </div>
                    <span className="text-zinc-500">to</span>
                    <div>
                      <Input
                        type="time"
                        value={slot.endTime}
                        onChange={(e) =>
                          updateDay(day.value, "endTime", e.target.value)
                        }
                        className="w-32"
                      />
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>

        <div className="mt-6 pt-6 border-t border-zinc-200">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Availability"}
          </Button>
          {message && (
            <p className={`mt-2 text-sm ${message.includes("Error") ? "text-red-600" : "text-green-600"}`}>
              {message}
            </p>
          )}
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-900">
          <strong>Note:</strong> All times are in your timezone (America/New_York by default). 
          Appointments are 30 minutes long.
        </p>
      </div>
    </div>
  )
}

