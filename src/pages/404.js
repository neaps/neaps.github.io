const NotFoundPage = () => {
  if (typeof window !== 'undefined') {
    const path = window.location.pathname
    const redirectMap = {
      '/': 'https://openwaters.io/tides/neaps',
      '/docs/harmonics': 'https://openwaters.io/tides/harmonics',
      '/docs/tide-prediction': 'https://openwaters.io/tides/neaps',
      '/docs/database': 'https://openwaters.io/tides/database'
    }

    const target = redirectMap[path] || 'https://openwaters.io'
    if (typeof window !== 'undefined') {
      window.location.replace(target)
    }
  }

  return null
}

export default NotFoundPage
