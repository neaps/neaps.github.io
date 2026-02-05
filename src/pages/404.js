import React, { useEffect } from 'react'

const NotFoundPage = () => {
  useEffect(() => {
    const path = window.location.pathname
    const redirectMap = {
      '/': 'https://openwaters.io/tides/neaps',
      '/docs/harmonics': 'https://openwaters.io/tides/harmonics',
      '/docs/tide-prediction': 'https://openwaters.io/tides/neaps',
      '/docs/database': 'https://openwaters.io/tides/database',
    }

    // Check if path matches any specific redirect
    if (redirectMap[path]) {
      window.location.href = redirectMap[path]
    } else {
      // Default redirect for all other paths
      window.location.href = 'https://openwaters.io'
    }
  }, [])

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Redirecting...</h1>
      <p>If you are not redirected automatically, <a href="https://openwaters.io">click here</a>.</p>
    </div>
  )
}

export default NotFoundPage
