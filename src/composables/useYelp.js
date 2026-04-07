import { ref } from 'vue'

const API_URL = 'https://api.yelp.com/v3/businesses/search'

export function useYelp() {
  const restaurants = ref([])
  const loading = ref(false)
  const error = ref(null)
  const searchedCity = ref('')

  const defaultCities = ['San Francisco', 'New York', 'Los Angeles', 'Chicago', 'Miami', 'Seattle', 'Austin', 'Boston', 'Denver', 'Portland']

  async function fetchRestaurants(cityName) {
    loading.value = true
    error.value = null

    try {
      const response = await fetch(
        import.meta.env.VITE_CORS_PROXY + encodeURIComponent(`${API_URL}?term=restaurants&location=${encodeURIComponent(cityName)}&limit=50`),
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_YELP_API_KEY}`,
          },
        }
      )
      const data = await response.json()

if (data.error) {
      const errorMsg = data.error.description || data.error.error || 'Something went wrong'
      if (errorMsg.includes('Could not execute search') || errorMsg.includes('location')) {
        error.value = 'City not found. Please try a more specific city name.'
      } else {
        error.value = errorMsg
      }
      return
    }

    restaurants.value = data.businesses || []

    if (restaurants.value.length === 0) {
      error.value = 'No restaurants found. Try another city!'
    }
    } catch (err) {
      error.value = 'Failed to fetch restaurants. Please try again.'
    } finally {
      loading.value = false
    }
  }

  function loadRandomCity() {
    const randomCity = defaultCities[Math.floor(Math.random() * defaultCities.length)]
    searchedCity.value = randomCity
    fetchRestaurants(randomCity)
  }

  function searchCity(cityName) {
    if (!cityName?.trim()) return
    searchedCity.value = cityName
    fetchRestaurants(cityName)
  }

  return {
    restaurants,
    loading,
    error,
    searchedCity,
    fetchRestaurants,
    loadRandomCity,
    searchCity,
  }
}
