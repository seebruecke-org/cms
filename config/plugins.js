const { join } = require('path');

module.exports = {
  'duplicate-button': true,
  graphql: {
    config: {
      defaultLimit: 1000,
      generateArtifacts: true,
      artifacts: {
        schema: join(__dirname, '..', 'exports', 'graphql', 'schema.graphql'),
        typegen: join(__dirname, '..', 'exports', 'graphql', 'types.d.ts'),
      },
    },
  },
};
