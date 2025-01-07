import Image from 'next/image'

export default function SponsoredAds() {
  const ads = [
    { 
      title: 'Premium Fitness Tracker', 
      description: 'Track your workouts with precision!',
      image: '/placeholder.svg?height=100&width=100'
    },
    { 
      title: 'Mindfulness App', 
      description: 'Reduce stress with guided meditations',
      image: '/placeholder.svg?height=100&width=100'
    },
    { 
      title: 'Productivity Planner', 
      description: 'Boost your efficiency with smart planning',
      image: '/placeholder.svg?height=100&width=100'
    },
    { 
      title: 'Healthy Recipe Book', 
      description: 'Delicious meals for a healthier you',
      image: '/placeholder.svg?height=100&width=100'
    },
  ]

  return (
    <div className="bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-2xl font-semibold mb-6 text-center">Recommended for You</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {ads.map((ad, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow duration-200">
              <Image src={ad.image} alt={ad.title} width={100} height={100} className="mx-auto mb-2" />
              <h3 className="text-lg font-semibold text-black mb-1">{ad.title}</h3>
              <p className="text-sm text-gray-600">{ad.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

