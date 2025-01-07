'use client'

import { useState, useEffect } from 'react'
import { openDB } from 'idb'
import { Bar } from 'react-chartjs-2'
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

type Habit = {
  id: number;
  name: string;
  streak: number;
  history: boolean[];
  lastCompleted: string | null;
  category: string;
}

export default function HabitInsights() {
  const [habits, setHabits] = useState<Habit[]>([])

  useEffect(() => {
    const fetchHabits = async () => {
      const db = await openDB('habit-tracker', 1)
      const habits = await db.getAll('habits')
      setHabits(habits)
    }
    fetchHabits()
  }, [])

  const data = {
    labels: habits.map(habit => habit.name),
    datasets: [
      {
        label: 'Current Streak',
        data: habits.map(habit => habit.streak),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Habit Streaks',
      },
    },
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Your Habit Insights</h2>
      <Bar data={data} options={options} />
    </div>
  )
}

