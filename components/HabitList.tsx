'use client'

import { useState, useEffect } from 'react'
import { Check, X, TrendingUp, Award } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { openDB, DBSchema } from 'idb'

interface HabitDB extends DBSchema {
  habits: {
    key: number;
    value: Habit;
  };
}

type Habit = {
  id: number;
  name: string;
  streak: number;
  history: boolean[];
  lastCompleted: string | null;
}

const DAYS_OF_WEEK = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export default function HabitList() {
  const [habits, setHabits] = useState<Habit[]>([])
  //const [selectedCategory, setSelectedCategory] = useState<string>('All')

  useEffect(() => {
    const initDB = async () => {
      const db = await openDB<HabitDB>('habit-tracker', 1, {
        upgrade(db) {
          db.createObjectStore('habits', { keyPath: 'id' });
        },
      });

      const storedHabits = await db.getAll('habits');
      setHabits(storedHabits);
    };

    initDB();

    const addHabitListener = async (event: CustomEvent<string>) => {
      const newHabit: Habit = {
        id: Date.now(),
        name: event.detail,
        streak: 0,
        history: Array(7).fill(false),
        lastCompleted: null
      }
      const db = await openDB<HabitDB>('habit-tracker', 1);
      await db.add('habits', newHabit);
      setHabits(prevHabits => [...prevHabits, newHabit]);
    }

    window.addEventListener('addHabit', addHabitListener as EventListener);

    return () => {
      window.removeEventListener('addHabit', addHabitListener as EventListener);
    }
  }, [])

  const updateHabit = async (updatedHabit: Habit) => {
    const db = await openDB<HabitDB>('habit-tracker', 1);
    await db.put('habits', updatedHabit);
    setHabits(prevHabits => prevHabits.map(habit => 
      habit.id === updatedHabit.id ? updatedHabit : habit
    ));
  }

  const removeHabit = async (id: number) => {
    const db = await openDB<HabitDB>('habit-tracker', 1);
    await db.delete('habits', id);
    setHabits(prevHabits => prevHabits.filter(habit => habit.id !== id));
  }

  const incrementStreak = async (id: number) => {
    const now = new Date()
    const today = now.toISOString().split('T')[0]

    const habitToUpdate = habits.find(habit => habit.id === id);
    if (habitToUpdate && habitToUpdate.lastCompleted !== today) {
      const updatedHabit = {
        ...habitToUpdate,
        streak: habitToUpdate.streak + 1,
        history: [true, ...habitToUpdate.history.slice(0, 6)],
        lastCompleted: today
      };
      await updateHabit(updatedHabit);
    }
  }

  const getDayIndex = (index: number) => {
    const today = new Date().getDay();
    return (today - index + 7) % 7;
  }

  const isCompletedToday = (habit: Habit) => {
    const today = new Date().toISOString().split('T')[0]
    return habit.lastCompleted === today
  }

  //const filteredHabits = selectedCategory === 'All' 
    //? habits 
    //: habits.filter(habit => habit.category === selectedCategory);

  return (
    <div className="space-y-4 mb-8">
      {/*<div className="flex justify-center space-x-2 mb-4">
        {['All', 'Health', 'Productivity', 'Personal'].map(category => (
          <Button
            key={category}
            onClick={() => setSelectedCategory(category)}
            variant={selectedCategory === category ? "default" : "outline"}
          >
            {category}
          </Button>
        ))}
      </div>*/}
      {habits.map(habit => (
        <motion.div 
          key={habit.id} 
          className={`p-3 rounded-lg flex items-center justify-between ${
            isCompletedToday(habit) ? 'bg-green-100' : 'bg-gray-100'
          }`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center space-x-4 flex-grow">
            <h3 className="text-lg font-semibold">{habit.name}</h3>
            <div className="flex space-x-1">
              {habit.history.map((day, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div
                    className={`w-4 h-4 rounded-full ${
                      day ? 'bg-black' : 'bg-gray-300'
                    }`}
                    title={DAYS_OF_WEEK[getDayIndex(index)]}
                  />
                </div>
              ))}
            </div>
            <span className="text-black font-semibold text-sm">Streak: {habit.streak}</span>
            {habit.streak > 0 && habit.streak % 7 === 0 && (
              <Award className="text-yellow-500" size={20} title="Weekly milestone achieved!" />
            )}
          </div>
          <div className="flex items-center space-x-2">
            {!isCompletedToday(habit) && (
              <Button 
                onClick={() => incrementStreak(habit.id)}
                size="icon"
                className="bg-green-500 hover:bg-green-600 text-white h-8 w-8"
              >
                <Check className="h-4 w-4" />
              </Button>
            )}
            <Button 
              onClick={() => removeHabit(habit.id)} 
              variant="outline" 
              size="icon"
              className="text-red-500 border-red-500 hover:bg-red-100 h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

