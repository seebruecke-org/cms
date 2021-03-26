const { ALGOLIA_PROJECT, ALGOLIA_ACCESS_TOKEN, ALGOLIA_INDEX } = process.env;

const algoliasearch = require('algoliasearch');

const client = algoliasearch(ALGOLIA_PROJECT, ALGOLIA_ACCESS_TOKEN);

const index = client.initIndex(ALGOLIA_INDEX);

module.exports = {
  save(data) {
    return index.saveObject(data, { autoGenerateObjectIDIfNotExist: true });
  },

  get(ids) {
    return index.getObjects(ids);
  },

  update(data) {
    return index.partialUpdateObjects(data);
  },

  delete(ids) {
    return index.deleteObjects(ids);
  },

  search(query, options = {}) {
    return index.search(query, options);
  },
};
