"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type BillEntry = {
  id: string
  name: string
  price: number
  quantity: number
  subtotal: number
}

type Bill = {
  id: string
  date: string
  entries: BillEntry[]
  total: number
  createdAt: number
}

interface BillHistoryProps {
  bills: Bill[]
}

export function BillHistory({ bills }: BillHistoryProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + "T00:00:00")
    return date.toLocaleDateString("en-BD", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const dailySummary = bills.reduce(
    (acc, bill) => {
      const existingDay = acc.find((d) => d.date === bill.date)
      if (existingDay) {
        existingDay.total += bill.total
        existingDay.billCount += 1
      } else {
        acc.push({
          date: bill.date,
          total: bill.total,
          billCount: 1,
        })
      }
      return acc
    },
    [] as Array<{ date: string; total: number; billCount: number }>,
  )

  // Show latest 50 days
  const recentDays = dailySummary.slice(0, 50)

  const selectedBills = selectedDate ? bills.filter((b) => b.date === selectedDate) : []
  const dailyTotal = selectedDate ? dailySummary.find((d) => d.date === selectedDate)?.total || 0 : 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
      {/* Daily Summary List */}
      <div className="md:col-span-1 space-y-2">
        <h3 className="text-base sm:text-lg font-semibold text-foreground mb-4">Recent Days ({recentDays.length})</h3>
        {recentDays.length === 0 ? (
          <p className="text-sm text-muted-foreground">No bills yet</p>
        ) : (
          <div className="space-y-2">
            {recentDays.map((day) => (
              <Button
                key={day.date}
                variant={selectedDate === day.date ? "default" : "outline"}
                onClick={() => setSelectedDate(day.date)}
                className="w-full justify-between text-left h-auto p-3"
              >
                <div className="flex flex-col items-start">
                  <span className="text-xs sm:text-sm font-medium">{formatDate(day.date)}</span>
                  <span className="text-xs text-muted-foreground">
                    {day.billCount} bill{day.billCount !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="text-right flex flex-col items-end">
                  <span className="text-xs sm:text-sm font-semibold">৳{day.total.toFixed(2)}</span>
                </div>
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* Day Details */}
      <div className="md:col-span-2">
        {selectedDate ? (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-1">{formatDate(selectedDate)}</h2>
              <p className="text-xs text-muted-foreground">
                {selectedBills.length} bill{selectedBills.length !== 1 ? "s" : ""}
              </p>
            </div>

            {/* Bills for the day */}
            <div className="space-y-3">
              {selectedBills.map((bill) => (
                <Card key={bill.id} className="p-3 sm:p-4 bg-secondary/30 border-border">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {new Date(bill.createdAt).toLocaleTimeString("en-BD", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    <p className="font-semibold text-primary text-xs sm:text-sm">৳{bill.total.toFixed(2)}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {bill.entries.length} item{bill.entries.length !== 1 ? "s" : ""}
                  </p>
                </Card>
              ))}
            </div>

            {/* Daily Total */}
            <div className="border-t border-border pt-4 mt-4">
              <div className="flex justify-between items-center">
                <span className="text-base sm:text-lg font-semibold text-foreground">Daily Total</span>
                <span className="text-xl sm:text-2xl font-bold text-primary">৳{dailyTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full min-h-64 sm:min-h-96">
            <p className="text-xs sm:text-base text-muted-foreground">Select a day to view bills</p>
          </div>
        )}
      </div>
    </div>
  )
}
