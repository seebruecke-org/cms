module.exports = {
  pathSuggest: async ({ request }) => {
    const { query } = JSON.parse(request.body);

    const res = await strapi.services.algolia.search(query, {
      hitsPerPage: 15,
    });

    return res;
  }
}
