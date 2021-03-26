/* eslint-disable no-param-reassign */
/* eslint-disable camelcase */
/* eslint-disable no-undef */

const pick = require('lodash.pick');

const attributes = [
  'id',
  'city',
  'updated_at',
];

module.exports = {
  lifecycles: {
    async afterCreate(data) {
      const { objectID } = await strapi.services.algolia.save({
        ...pick(data, attributes),
        contentType: 'group',
      });

      data.algolia_id = objectID;
    },

    async afterUpdate(data) {
      const { algolia_id } = data;

      if (algolia_id) {
        const picked = pick(data, attributes);
        picked.objectID = algolia_id;

        const { objectID } = await strapi.services.algolia.update({
          ...picked,
          contentType: 'group',
        });

        data.algolia_id = objectID;
      } else {
        const { objectID } = await strapi.services.algolia.save(pick(data, attributes));

        data.algolia_id = objectID;
      }
    },

    async afterDelete(data) {
      const { algolia_id } = data;

      if (algolia_id) {
        await strapi.services.algolia.delete([algolia_id]);
      }
    },
  },
};
