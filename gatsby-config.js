module.exports = {
  siteMetadata: {
    title: `Neaps tide library`,
    description: `Javascript tide harmonics and predictions.`,
    harmonicsServer: `https://enigmatic-sea-16360.herokuapp.com/api/v1/`,
    harmonicsSocket: 'ws://enigmatic-sea-16360.herokuapp.com'
  },
  plugins: [
    {
      resolve: `gatsby-source-noaa-tides`,
      options: {
        stations: ['9413450', '9411340', '2695535', '8410140']
      }
    },
    {
      resolve: `gatsby-plugin-typography`,
      options: {
        pathToConfigModule: `src/style/typography`
      }
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `tidePredictorReadme`,
        path: `${__dirname}/node_modules/@neaps/tide-predictor/README.md`
      }
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-prismjs`,
            options: {
              inlineCodeMarker: null
            }
          }
        ]
      }
    }
  ]
}
