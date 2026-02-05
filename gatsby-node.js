exports.onCreateWebpackConfig = ({ stage, loaders, actions }) => {
  const { setWebpackConfig } = actions

  if (stage === 'build-html') {
    setWebpackConfig({
      module: {
        rules: [
          {
            test: /leaflet/,
            use: loaders.null()
          }
        ]
      }
    })
  }
}

exports.createPages = async ({ actions }) => {
  const { createRedirect } = actions

  createRedirect({
    fromPath: `/docs/harmonics`,
    toPath: `https://openwaters.io/tides/harmonics`,
    isPermanent: true,
    redirectInBrowser: true
  })

  createRedirect({
    fromPath: `/docs/database`,
    toPath: `https://openwaters.io/tides/database`,
    isPermanent: true,
    redirectInBrowser: true
  })

  // Catch-all redirect for everything else
  createRedirect({
    fromPath: `/*`,
    toPath: `https://openwaters.io/tides/neaps`,
    isPermanent: true,
    redirectInBrowser: true
  })
}
