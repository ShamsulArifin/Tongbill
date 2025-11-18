"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Trash2 } from "lucide-react"

type MenuItem = {
  id: string
  name: string
  price: number
  emoji: string
}

interface MenuManagerProps {
  menuItems: MenuItem[]
  onAddItem: (item: Omit<MenuItem, "id">) => void
  onDeleteItem: (id: string) => void
}

const EMOJI_OPTIONS = [
  "☕",
  "🍵",
  "🥐",
  "🍰",
  "🧁",
  "🍪",
  "🥯",
  "🍩",
  "🥓",
  "🍳",
  "🥤",
  "🧋",
  "🍶",
  "🍷",
  "🍺",
  "🍹",
  "🍸",
  "🥛",
  "🍼",
  "🧃",
  "🍔",
  "🍕",
  "🍝",
  "🍜",
  "🍲",
  "🥘",
  "🍛",
  "🍱",
  "🥞",
  "🥨",
  "🥐",
  "🍞",
  "🥖",
  "🧈",
  "🍯",
  "🥜",
  "🌰",
  "🍫",
  "🍬",
  "🍭",
]

export function MenuManager({ menuItems, onAddItem, onDeleteItem }: MenuManagerProps) {
  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [emoji, setEmoji] = useState("☕")
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim() || !price.trim()) {
      alert("Please fill in all fields")
      return
    }

    const priceNum = Number.parseFloat(price)
    if (isNaN(priceNum) || priceNum <= 0) {
      alert("Price must be a positive number")
      return
    }

    onAddItem({
      name: name.trim(),
      price: priceNum,
      emoji: emoji || "☕",
    })

    setName("")
    setPrice("")
    setEmoji("☕")
    setShowEmojiPicker(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-4">Add Menu Item</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <div className="relative">
              <label className="block text-xs sm:text-sm font-medium text-foreground mb-1">Emoji</label>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="w-full text-2xl h-10 bg-input"
              >
                {emoji}
              </Button>
              {/* Emoji picker dropdown */}
              {showEmojiPicker && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg p-2 grid grid-cols-6 gap-1 z-50 max-h-48 overflow-y-auto shadow-lg">
                  {EMOJI_OPTIONS.map((e) => (
                    <button
                      key={e}
                      type="button"
                      onClick={() => {
                        setEmoji(e)
                        setShowEmojiPicker(false)
                      }}
                      className="text-xl hover:bg-secondary p-1 rounded hover:scale-110 transition-transform"
                    >
                      {e}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="sm:col-span-1 md:col-span-2">
              <label className="block text-xs sm:text-sm font-medium text-foreground mb-1">Item Name</label>
              <Input
                type="text"
                placeholder="e.g., Espresso"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-input text-sm"
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-foreground mb-1">Price</label>
              <Input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="bg-input text-sm"
              />
            </div>
          </div>
          <Button type="submit" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-sm">
            Add Item
          </Button>
        </form>
      </div>

      {/* Menu Items List */}
      <div>
        <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-4">Current Menu ({menuItems.length})</h3>
        {menuItems.length === 0 ? (
          <p className="text-sm text-muted-foreground">No menu items yet. Add your first item above.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {menuItems.map((item) => (
              <Card
                key={item.id}
                className="p-3 sm:p-4 flex items-center justify-between bg-secondary/50 border-border"
              >
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  <span className="text-xl sm:text-2xl flex-shrink-0">{item.emoji}</span>
                  <div className="min-w-0">
                    <p className="font-medium text-foreground text-sm truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground">৳{item.price.toFixed(2)}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDeleteItem(item.id)}
                  className="text-destructive hover:bg-destructive/10 flex-shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
