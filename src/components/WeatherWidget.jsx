'use client'

import { useEffect, useState } from 'react'
import { getUserLocation, getWeatherByCoords } from '@/services/weatherService'

export default function WeatherWidget() {
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const { lat, lon } = await getUserLocation()
        const data = await getWeatherByCoords(lat, lon)
        if (!cancelled) setWeather(data)
      } catch {
        if (!cancelled) setError('Clima indisponível')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  if (loading) return <span className="text-xs text-gray-400">Carregando clima...</span>
  if (error) return <span className="text-xs text-gray-400">{error}</span>

  return (
    <div className="flex items-center gap-1 text-sm text-gray-700 dark:text-gray-300">
      <span role="img" aria-label={weather.description}>{weather.emoji}</span>
      <span className="font-semibold">{weather.temp}°C</span>
      <span className="hidden sm:inline text-gray-500 dark:text-gray-400">— {weather.city}</span>
    </div>
  )
}
