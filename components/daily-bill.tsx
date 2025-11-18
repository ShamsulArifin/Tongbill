"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { X, Plus } from 'lucide-react'

type MenuItem = {
  id: string
  name: string
  price: number
  emoji: string
}

type BillEntry = {
  id: string
  name: string
  price: number
  quantity: number
  subtotal: number
}

interface DailyBillProps {
  menuItems: MenuItem[]
  onSaveBill: (date: string, entries: BillEntry[]) => void
}

export function DailyBill({ menuItems, onSaveBill }: DailyBillProps) {
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedItemId, setSelectedItemId] = useState("")
  const [quantity, setQuantity] = useState("")
  const [entries, setEntries] = useState<BillEntry[]>([])
  const [message, setMessage] = useState("")

  // Set default date to today
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0]
    setSelectedDate(today)
  }, [])

  const handleAddItem = () => {
    if (!selectedItemId || !quantity) {
      setMessage("Please select an item and quantity")
      setTimeout(() => setMessage(""), 3000)
      return
    }

    const quantityNum = Number.parseInt(quantity)
    if (isNaN(quantityNum) || quantityNum <= 0) {
      setMessage("Quantity must be a positive number")
      setTimeout(() => setMessage(""), 3000)
      return
    }

    const item = menuItems.find((m) => m.id === selectedItemId)
    if (!item) return

    const newEntry: BillEntry = {
      id: Date.now().toString(),
      name: item.name,
      price: item.price,
      quantity: quantityNum,
      subtotal: item.price * quantityNum,
    }

    setEntries([...entries, newEntry])
    setSelectedItemId("")
    setQuantity("")
    setMessage("Item added to bill")
    setTimeout(() => setMessage(""), 2000)
  }

  const handleRemoveEntry = (id: string) => {
    setEntries(entries.filter((e) => e.id !== id))
  }

  const handleSaveBill = () => {
    if (entries.length === 0) {
      setMessage("Add items to the bill first")
      setTimeout(() => setMessage(""), 3000)
      return
    }

    onSaveBill(selectedDate, entries)
    setEntries([])
    setMessage("Bill saved successfully!")
    setTimeout(() => setMessage(""), 3000)
  }

  const total = entries.reduce((sum, entry) => sum + entry.subtotal, 0)

  return (
    <div className="space-y-6">
      {/* Message */}
      {message && (
        <div className="p-3 sm:p-4 rounded-lg bg-accent/20 text-accent-foreground border border-accent/30 text-sm">
          {message}
        </div>
      )}

      {/* Date Selector */}
      <div>
        <label className="block text-xs sm:text-sm font-medium text-foreground mb-2">Select Date</label>
        <Input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="bg-input text-sm"
        />
      </div>

      {/* Item Selection */}
      <div className="space-y-4">
        <h3 className="text-base sm:text-lg font-semibold text-foreground">Add Items</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-foreground mb-2">Select Item</label>
            <select
              value={selectedItemId}
              onChange={(e) => setSelectedItemId(e.target.value)}
              className="w-full px-2 sm:px-3 py-2 rounded-md bg-input border border-border text-foreground text-xs sm:text-sm"
            >
              <option value="">-- Choose an item --</option>
              {menuItems.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.emoji} {item.name} - ৳{item.price.toFixed(2)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-foreground mb-2">Quantity</label>
            <Input
              type="number"
              min="1"
              placeholder="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="bg-input text-sm"
            />
          </div>
          <div className="flex items-end">
            <Button onClick={handleAddItem} className="w-full bg-primary hover:bg-primary/90 text-xs sm:text-sm">
              <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Add
            </Button>
          </div>
        </div>
      </div>

      {/* Bill Items */}
      <div className="space-y-4">
        <h3 className="text-base sm:text-lg font-semibold text-foreground">Current Bill</h3>
        {entries.length === 0 ? (
          <p className="text-sm text-muted-foreground">No items added yet</p>
        ) : (
          <div className="space-y-1">
            {entries.map((entry) => (
              <Card
                key={entry.id}
                className="p-1 flex items-center justify-between bg-secondary/30 border-border flex-row"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground text-xs">{entry.name}</p>
                  <p className="text-xs text-muted-foreground">
                    ৳{entry.price.toFixed(2)} × {entry.quantity} = ৳{entry.subtotal.toFixed(2)}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveEntry(entry.id)}
                  className="text-destructive hover:bg-destructive/10 flex-shrink-0"
                >
                  <X className="w-3 h-3" />
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Total and Save */}
      {entries.length > 0 && (
        <div className="space-y-4 border-t border-border pt-4">
          <div className="bg-primary/10 p-3 sm:p-4 rounded-lg border border-primary/20">
            <p className="text-xs text-muted-foreground mb-1">Grand Total</p>
            <p className="text-2xl sm:text-3xl font-bold text-primary">৳{total.toFixed(2)}</p>
          </div>
          <Button onClick={handleSaveBill} className="w-full bg-primary hover:bg-primary/90 text-sm py-5 sm:py-6">
            Save Bill
          </Button>
        </div>
      )}
    </div>
  )
}
