// components/ui/toggle-theme.tsx
"use client"
import { useEffect, useState } from "react"
import { Button } from "./button"
import { Sun, Moon } from "lucide-react"

export default function ToggleTheme() {
  const [theme, setTheme] = useState("light")

  useEffect(() => {
    const stored = localStorage.getItem("theme") || "light"
    setTheme(stored)
    document.documentElement.classList.toggle("dark", stored === "dark")
  }, [])

  const toggle = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)
    document.documentElement.classList.toggle("dark", newTheme === "dark")
  }

  return (
    <Button onClick={toggle} variant="outline" size="sm">
      {theme === "light" ? <Moon className="mr-2 h-4 w-4" /> : <Sun className="mr-2 h-4 w-4" />}
      {theme === "light" ? "Escuro" : "Claro"}
    </Button>
  )
}