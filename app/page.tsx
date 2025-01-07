import HabitList from '@/components/HabitList'
import AddHabitForm from '@/components/AddHabitForm'
import HabitInsights from '@/components/HabitInsights'
import SponsoredAds from '@/components/SponsoredAds'

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      <main className="flex-grow p-4 sm:p-6 md:p-8 max-w-4xl mx-auto w-full">
        <h1 className="text-3xl font-bold text-center mb-8">Habit Tracker</h1>
        <AddHabitForm />
        <HabitList />
        <HabitInsights />
      </main>
      <footer className="mt-auto">
        <SponsoredAds />
      </footer>
    </div>
  )
}

