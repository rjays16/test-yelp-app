exports.handler = async (event) => {
  const city = event.queryStringParameters.city

  if (!city) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'City is required' }),
    }
  }

  const API_KEY = process.env.YELP_API_KEY

  if (!API_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'API key not configured' }),
    }
  }

  try {
    const response = await fetch(
      `https://api.yelp.com/v3/businesses/search?term=restaurants&location=${encodeURIComponent(city)}&limit=50`,
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        },
      }
    )

    const data = await response.json()

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    }
  }
}
