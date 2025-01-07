'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function AddHabitForm() {
  const [habitName, setHabitName] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (habitName.trim()) {
      const addHabitEvent = new CustomEvent('addHabit', { 
        detail: habitName.trim()
      })
      window.dispatchEvent(addHabitEvent)
      setHabitName('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6 space-y-4">
      <div className="flex space-x-2">
        <Input
          type="text"
          value={habitName}
          onChange={(e) => setHabitName(e.target.value)}
          placeholder="Enter new habit"
          className="flex-grow"
        />
      </div>
      <Button type="submit" className="w-full bg-black hover:bg-gray-800 text-white">
        Add Habit
      </Button>
    </form>
  )
}

