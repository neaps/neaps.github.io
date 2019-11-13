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
