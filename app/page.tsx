"use client"

import { useState, useEffect } from "react"
import { MenuManager } from "@/components/menu-manager"
import { DailyBill } from "@/components/daily-bill"
import { BillHistory } from "@/components/bill-history"
import { Button } from "@/components/ui/button"

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

type Bill = {
  id: string
  date: string
  entries: BillEntry[]
  total: number
  createdAt: number
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<"menu" | "bill" | "history">("menu")
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [bills, setBills] = useState<Bill[]>([])

  // Load from localStorage on mount
  useEffect(() => {
    const savedMenu = localStorage.getItem("menuItems")
    const savedBills = localStorage.getItem("bills")

    if (savedMenu) {
      try {
        setMenuItems(JSON.parse(savedMenu))
      } catch (e) {
        console.error("Failed to load menu items")
      }
    }

    if (savedBills) {
      try {
        setBills(JSON.parse(savedBills))
      } catch (e) {
        console.error("Failed to load bills")
      }
    }
  }, [])

  // Save menu to localStorage
  useEffect(() => {
    localStorage.setItem("menuItems", JSON.stringify(menuItems))
  }, [menuItems])

  // Save bills to localStorage
  useEffect(() => {
    localStorage.setItem("bills", JSON.stringify(bills))
  }, [bills])

  const handleAddMenuItem = (item: Omit<MenuItem, "id">) => {
    const newItem: MenuItem = {
      ...item,
      id: Date.now().toString(),
    }
    setMenuItems([...menuItems, newItem])
  }

  const handleDeleteMenuItem = (id: string) => {
    setMenuItems(menuItems.filter((item) => item.id !== id))
  }

  const handleSaveBill = (date: string, entries: BillEntry[]) => {
    const total = entries.reduce((sum, entry) => sum + entry.subtotal, 0)
    const newBill: Bill = {
      id: Date.now().toString(),
      date,
      entries,
      total,
      createdAt: Date.now(),
    }
    setBills([newBill, ...bills])
  }

  return (
    <main className="cafe-pattern min-h-screen flex flex-col">
      <div className="cafe-content container max-w-4xl mx-auto px-3 sm:px-4 py-6 sm:py-8 flex-grow">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-bold text-primary mb-2">☕ Tongbill</h1>
          <p className="text-sm sm:text-base text-muted-foreground">No Surprises — Just Your Total.</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 sm:gap-2 mb-6 sm:mb-8 border-b border-border flex-wrap">
          <Button
            variant={activeTab === "menu" ? "default" : "ghost"}
            onClick={() => setActiveTab("menu")}
            className="rounded-b-none text-xs sm:text-sm"
          >
            Menu Management
          </Button>
          <Button
            variant={activeTab === "bill" ? "default" : "ghost"}
            onClick={() => setActiveTab("bill")}
            className="rounded-b-none text-xs sm:text-sm"
          >
            Daily Bill
          </Button>
          <Button
            variant={activeTab === "history" ? "default" : "ghost"}
            onClick={() => setActiveTab("history")}
            className="rounded-b-none text-xs sm:text-sm"
          >
            Bill History
          </Button>
        </div>

        {/* Content */}
        <div className="bg-card rounded-lg shadow-md p-4 sm:p-6">
          {activeTab === "menu" && (
            <MenuManager menuItems={menuItems} onAddItem={handleAddMenuItem} onDeleteItem={handleDeleteMenuItem} />
          )}
          {activeTab === "bill" && <DailyBill menuItems={menuItems} onSaveBill={handleSaveBill} />}
          {activeTab === "history" && <BillHistory bills={bills} />}
        </div>
      </div>

      <footer className="footer-glass mt-8 py-4 text-center text-xs sm:text-sm text-muted-foreground">
        <p>Made with ❤️ by<a href="https://portfolio-eta-seven-57.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-blue-500 cursor-pointer font-bold">Shamsul Arifin</a></p>
      </footer>
    </main>
  )
}
