import Config from "./config"

const fetchApi = async (endpoint: string, options?: RequestInit) => {
  const response = await fetch(`${Config.ApiUrl}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || 'Network response was not ok')
  }

  return response.json()
}

export default fetchApi
