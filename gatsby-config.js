module.exports = {
  siteMetadata: {
    title: `Gatsby Default Starter`,
    description: `Kick off your next, great Gatsby project with this default starter. This barebones starter ships with the main Gatsby configuration files you might need.`,
    author: `@gatsbyjs`
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
