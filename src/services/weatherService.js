export function getUserLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation não suportada'))
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      (err) => reject(err)
    )
  })
}

async function getCityName(lat, lon) {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
  const res = await fetch(url, { headers: { 'Accept-Language': 'pt-BR' } })
  if (!res.ok) return null
  const data = await res.json()
  return data.address?.city || data.address?.town || data.address?.village || data.address?.county || null
}

// Mapeamento dos códigos WMO para descrição e ícone emoji
const WMO_CODES = {
  0:  { description: 'céu limpo',        emoji: '☀️' },
  1:  { description: 'predominantemente limpo', emoji: '🌤️' },
  2:  { description: 'parcialmente nublado', emoji: '⛅' },
  3:  { description: 'nublado',           emoji: '☁️' },
  45: { description: 'neblina',           emoji: '🌫️' },
  48: { description: 'geada',             emoji: '🌫️' },
  51: { description: 'garoa leve',        emoji: '🌦️' },
  53: { description: 'garoa moderada',    emoji: '🌦️' },
  55: { description: 'garoa intensa',     emoji: '🌧️' },
  61: { description: 'chuva leve',        emoji: '🌧️' },
  63: { description: 'chuva moderada',    emoji: '🌧️' },
  65: { description: 'chuva intensa',     emoji: '🌧️' },
  71: { description: 'neve leve',         emoji: '🌨️' },
  73: { description: 'neve moderada',     emoji: '❄️' },
  75: { description: 'neve intensa',      emoji: '❄️' },
  80: { description: 'pancadas de chuva', emoji: '🌦️' },
  81: { description: 'chuva com trovoada',emoji: '⛈️' },
  95: { description: 'tempestade',        emoji: '⛈️' },
  99: { description: 'tempestade com granizo', emoji: '⛈️' },
}

export async function getWeatherByCoords(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weathercode&timezone=auto`
  const [weatherRes, city] = await Promise.all([
    fetch(url),
    getCityName(lat, lon),
  ])
  if (!weatherRes.ok) throw new Error('Erro ao buscar clima')
  const data = await weatherRes.json()
  const code = data.current.weathercode
  const { description, emoji } = WMO_CODES[code] ?? { description: 'clima variado', emoji: '🌡️' }
  return {
    city: city ?? 'sua cidade',
    temp: Math.round(data.current.temperature_2m),
    description,
    emoji,
  }
}
